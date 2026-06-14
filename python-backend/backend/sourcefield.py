import numpy as np
import hashlib


def sha256_hash(data):
    return hashlib.sha256(data.encode()).hexdigest()


class SourceFieldV11:
    def __init__(self, n_agents=3, state_size=100, timesteps=800):
        self.n_agents = n_agents
        self.state_size = state_size
        self.timesteps = timesteps

        self.gamma = 0.05
        self.kappa = 0.005
        self.step_size = 0.0006
        self.epsilon = 1e-8
        self.beta = 1.0073

        self.A = 1.0
        self.lam = 1.0
        self.f = 0.05
        self.phi = 0.0

        # Controlled input bridge. These values are intentionally small so the
        # prompt can move the waveform without overpowering the original engine.
        self.query_influence = 0.25
        self.query_phase_influence = 0.15
        self.query_frequency_influence = 0.01

        self.agents = [
            np.random.randn(state_size) + 1j * np.random.randn(state_size)
            for _ in range(n_agents)
        ]

        self.C_hist = [[] for _ in range(n_agents)]
        self.delta_phi_hist = [[] for _ in range(n_agents)]
        self.energy_input_hist = [[] for _ in range(n_agents)]
        self.energy_state_hist = [[] for _ in range(n_agents)]
        self.classification_hist = [[] for _ in range(n_agents)]
        self.rho_hist = [[] for _ in range(n_agents)]
        self.chi_hist = [[] for _ in range(n_agents)]
        self.xi_hist = [[] for _ in range(n_agents)]
        self.flags_hist = [[] for _ in range(n_agents)]

        self.genesis_hash = None
        self.session_hash = None
        self.current_hash = None
        self.milestone_layers = []

        self.C0 = None
        self.delta_phi0 = None
        self.S0_energy = None
        self.Psi0_energy = None
        self.chi0 = 1.0

        self.tau_input = None
        self.tau_state = None

        self.query_hash = None
        self.query_phase_shift = 0.0
        self.query_frequency_shift = 0.0

    def build_query_vector(self, query_text):
        if not query_text:
            return np.zeros(self.state_size, dtype=complex)

        query_hash = hashlib.sha256(query_text.encode()).hexdigest()
        self.query_hash = query_hash

        repeated = (query_hash * ((self.state_size // len(query_hash)) + 2))[
            : self.state_size
        ]

        values = np.array([int(ch, 16) for ch in repeated], dtype=float)
        values = values - np.mean(values)
        values = values / (np.linalg.norm(values) + self.epsilon)

        phase_values = np.array([int(ch, 16) / 15.0 for ch in repeated], dtype=float)
        complex_phase = np.exp(1j * 2 * np.pi * phase_values)

        query_vector = values * complex_phase
        query_vector = query_vector / (np.linalg.norm(query_vector) + self.epsilon)

        return query_vector.astype(complex)

    def apply_query_environment(self, query_text):
        if not query_text:
            self.query_phase_shift = 0.0
            self.query_frequency_shift = 0.0
            return

        query_hash = hashlib.sha256(query_text.encode()).hexdigest()
        hash_integer = int(query_hash[:8], 16)

        self.query_phase_shift = (
            (hash_integer % 360) * np.pi / 180.0
        ) * self.query_phase_influence

        normalized_length = min(len(query_text), 1000) / 1000.0
        entropy_hint = len(set(query_text.lower())) / max(len(query_text), 1)

        self.query_frequency_shift = self.query_frequency_influence * (
            normalized_length + entropy_hint
        )

    def root_standing_wave(self, t):
        x = np.linspace(0, 1, self.state_size)
        wave = (
            2
            * self.A
            * np.sin((2 * np.pi / self.lam) * x)
            * np.cos(
                2 * np.pi * (self.f + self.query_frequency_shift) * t
                + self.phi
                + self.query_phase_shift
            )
        )
        return wave.astype(complex)

    def coherence(self, S, Psi):
        norm_S = np.linalg.norm(S)
        norm_Psi = np.linalg.norm(Psi)
        if norm_S < self.epsilon or norm_Psi < self.epsilon:
            return 0.0
        return np.real(np.vdot(S, Psi)) / (norm_S * norm_Psi + self.epsilon)

    def phase_divergence(self, S, Psi):
        cos_sim = np.clip(self.coherence(S, Psi), -1.0, 1.0)
        return float(np.arccos(cos_sim))

    def compute_biofield(self, t):
        bio_intensity = np.clip(0.7 + 0.3 * np.sin(0.01 * t), 0.5, 1.0)
        magnitude = np.exp(-2.0 / (bio_intensity + self.epsilon))
        phase = np.exp(1j * 2 * np.pi * bio_intensity)
        return magnitude * phase * np.ones(self.state_size, dtype=complex)

    def hessian(self, Psi_bio, local_coherence):
        scaling_factor = np.clip(1.0 - local_coherence, 0.1, 1.0)
        return scaling_factor / (np.abs(Psi_bio) ** 2 + self.epsilon)

    def calibrate(self, n_null=10):
        rng = np.random.RandomState(42)

        input_samples = []
        state_samples = []

        for _ in range(n_null):
            S = rng.randn(self.state_size) + 1j * rng.randn(self.state_size)

            for t in range(self.timesteps):
                Psi = self.root_standing_wave(t)

                input_energy = float(np.sum(np.abs(Psi) ** 2))
                state_energy = float(np.linalg.norm(S) ** 2)

                input_samples.append(input_energy)
                state_samples.append(state_energy)

                Psi_bio = self.compute_biofield(t)
                H = self.hessian(Psi_bio, 0)
                S = S + 0.01 * H * Psi

        self.tau_input = np.percentile(input_samples, 95)
        self.tau_state = np.percentile(state_samples, 75)

    def initialize_genesis(self, Psi0):
        S0 = self.agents[0]

        self.C0 = self.coherence(S0, Psi0)
        self.delta_phi0 = self.phase_divergence(S0, Psi0)
        self.S0_energy = float(np.linalg.norm(S0) ** 2)
        self.Psi0_energy = float(np.sum(np.abs(Psi0) ** 2))

        self.genesis_hash = sha256_hash(
            str(self.C0)
            + str(self.delta_phi0)
            + str(self.S0_energy)
            + str(self.chi0)
            + str(self.Psi0_energy)
            + str(0)
            + str(self.query_hash)
        )

        self.current_hash = self.genesis_hash

    def add_milestone(self, name, value, protocol, t):
        new_hash = sha256_hash(
            str(self.current_hash) + str(name) + str(value) + str(protocol) + str(t)
        )

        layer = {
            "layer_index": len(self.milestone_layers),
            "name": name,
            "value": value,
            "protocol": protocol,
            "time": t,
            "hash": new_hash,
        }

        self.milestone_layers.append(layer)
        self.current_hash = new_hash

    def classify_state(self, input_energy, state_energy):
        input_high = input_energy >= self.tau_input
        state_high = state_energy >= self.tau_state

        if input_high and state_high:
            return "Coherent Identity"
        elif input_high and not state_high:
            return "Resonance Without Roots"
        elif not input_high and state_high:
            return "Dissociation"
        else:
            return "Full Incoherence"

    def compute_flag(self, C_t, delta_phi_t, state_energy, input_energy, rho_t):
        drift_pass = (
            C_t >= self.C0 - 0.05
            and delta_phi_t <= self.delta_phi0 + 0.05
            and state_energy >= self.S0_energy - 0.1
        )

        classification = self.classify_state(input_energy, state_energy)

        if drift_pass:
            return (
                "COMPRESSED"
                if classification == "Resonance Without Roots"
                else "COHERENT"
            )

        return "RECOVERING" if rho_t > 0 else "DRIFTED"

    def run(self, query_text=""):
        self.apply_query_environment(query_text)
        query_vector = self.build_query_vector(query_text)

        self.calibrate()
        Psi0 = self.root_standing_wave(0)
        self.initialize_genesis(Psi0)

        for t in range(self.timesteps):
            Psi = self.root_standing_wave(t)
            Psi_bio = self.compute_biofield(t)

            new_agents = []

            for i, S in enumerate(self.agents):
                interaction = sum(
                    self.kappa * (Sj - S) for j, Sj in enumerate(self.agents) if j != i
                )

                C_t = self.coherence(S, Psi)
                delta_phi_t = self.phase_divergence(S, Psi)
                state_energy = float(np.linalg.norm(S) ** 2)
                input_energy = float(np.sum(np.abs(Psi) ** 2))

                classification = self.classify_state(input_energy, state_energy)

                C_prev = self.C_hist[i][-1] if t > 0 else C_t
                phi_prev = self.delta_phi_hist[i][-1] if t > 0 else delta_phi_t
                S_prev_energy = self.energy_state_hist[i][-1] if t > 0 else state_energy

                grad_internal = Psi
                coherence_gate = self.coherence(S, Psi_bio)
                grad_bio = self.gamma * Psi_bio * coherence_gate

                query_coherence = self.coherence(S, query_vector)
                grad_query = query_vector * query_coherence * self.query_influence

                local_coherence = self.coherence(S, Psi_bio)
                H = self.hessian(Psi_bio, local_coherence)

                S_new = S + self.step_size * H * (
                    grad_internal + grad_bio + grad_query + interaction
                )

                S_norm = np.linalg.norm(S_new)
                if S_norm > 0:
                    S_new = S_new / S_norm * min(S_norm, np.sqrt(self.tau_state))

                self.C_hist[i].append(C_t)
                self.delta_phi_hist[i].append(delta_phi_t)
                self.energy_input_hist[i].append(input_energy)
                self.energy_state_hist[i].append(state_energy)
                self.classification_hist[i].append(classification)

                lambda_C = C_t - C_prev
                lambda_phi = phi_prev - delta_phi_t
                lambda_S = state_energy - S_prev_energy

                delta_C = max(self.C0 - C_t, 0) / (self.C0 + self.epsilon)
                delta_phi = max(delta_phi_t - self.delta_phi0, 0) / np.pi
                delta_S = max(self.S0_energy - state_energy, 0) / (
                    self.S0_energy + self.epsilon
                )

                w_C = self.C0 * (1 + delta_C)
                w_phi = (np.pi - self.delta_phi0) * self.beta * (1 + delta_phi)
                w_S = self.S0_energy * (1 + delta_S)

                norm = w_C + w_phi + w_S + self.epsilon
                w_C /= norm
                w_phi /= norm
                w_S /= norm

                rho_t = w_C * lambda_C + w_phi * lambda_phi + w_S * lambda_S
                self.rho_hist[i].append(rho_t)

                chi_t = (
                    (C_t / (self.C0 + self.epsilon))
                    * ((np.pi - delta_phi_t) / (np.pi - self.delta_phi0 + self.epsilon))
                    ** self.beta
                    * (state_energy / (self.S0_energy + self.epsilon))
                )
                self.chi_hist[i].append(chi_t)

                xi_t = chi_t * np.sign(rho_t)
                self.xi_hist[i].append(xi_t)

                flag = self.compute_flag(
                    C_t, delta_phi_t, state_energy, input_energy, rho_t
                )
                self.flags_hist[i].append(flag)

                new_agents.append(S_new)

            self.agents = new_agents

        self.session_hash = sha256_hash(
            str(self.current_hash)
            + str(self.genesis_hash)
            + str(self.query_hash)
            + str(query_text)
            + str(self.milestone_layers)
            + str(self.C_hist)
            + str(self.delta_phi_hist)
            + str(self.energy_input_hist)
            + str(self.energy_state_hist)
            + str(self.classification_hist)
            + str(self.rho_hist)
            + str(self.chi_hist)
            + str(self.xi_hist)
            + str(self.flags_hist)
        )

        return {
            "genesis_hash": self.genesis_hash,
            "session_hash": self.session_hash,
            "current_hash": self.current_hash,
            "query_hash": self.query_hash,
            "query_phase_shift": self.query_phase_shift,
            "query_frequency_shift": self.query_frequency_shift,
            "tau_input": self.tau_input,
            "tau_state": self.tau_state,
            "C_hist": self.C_hist,
            "delta_phi_hist": self.delta_phi_hist,
            "energy_input_hist": self.energy_input_hist,
            "energy_state_hist": self.energy_state_hist,
            "classification_hist": self.classification_hist,
            "rho_hist": self.rho_hist,
            "chi_hist": self.chi_hist,
            "xi_hist": self.xi_hist,
            "flags_hist": self.flags_hist,
            "final_classifications": [
                agent_classifications[-1] if agent_classifications else None
                for agent_classifications in self.classification_hist
            ],
        }


# ============================================================
# PARAMETER SWEEP
# ============================================================


def run_parameter_sweep():

    gamma_values = [0.05, 0.06]
    kappa_values = [0.003, 0.005, 0.007]
    step_sizes = [0.0005, 0.0006, 0.0007, 0.0008]

    print("\n==============================")
    print("SOURCEFIELD PARAMETER SWEEP")
    print("==============================\n")

    for gamma in gamma_values:

        for kappa in kappa_values:

            for step_size in step_sizes:

                sf = SourceFieldV11(n_agents=3, state_size=100, timesteps=800)

                sf.gamma = gamma
                sf.kappa = kappa
                sf.step_size = step_size

                results = sf.run("parameter sweep baseline")

                avg_C = np.mean([hist[-1] for hist in results["C_hist"]])

                avg_phi = np.mean([hist[-1] for hist in results["delta_phi_hist"]])

                avg_rho = np.mean([hist[-1] for hist in results["rho_hist"]])

                max_chi = np.max([abs(hist[-1]) for hist in results["chi_hist"]])

                final_classes = results["final_classifications"]

                trajectory_summary = []

                for agent_idx in range(len(results["C_hist"])):

                    C_hist = results["C_hist"][agent_idx]
                    phi_hist = results["delta_phi_hist"][agent_idx]
                    rho_hist = results["rho_hist"][agent_idx]

                    start_C = C_hist[0]
                    mid_C = C_hist[len(C_hist) // 2]
                    final_C = C_hist[-1]

                    start_phi = phi_hist[0]
                    mid_phi = phi_hist[len(phi_hist) // 2]
                    final_phi = phi_hist[-1]

                    positive_rho_ratio = np.mean(np.array(rho_hist) > 0)

                    trajectory_summary.append(
                        {
                            "agent": agent_idx,
                            "start_C": start_C,
                            "mid_C": mid_C,
                            "final_C": final_C,
                            "start_phi": start_phi,
                            "mid_phi": mid_phi,
                            "final_phi": final_phi,
                            "positive_rho_ratio": positive_rho_ratio,
                        }
                    )

                print("--------------------------------")

                print(f"gamma = {gamma}")

                print(f"kappa = {kappa}")

                print(f"step_size = {step_size}")

                print(f"avg_C = {avg_C}")

                print(f"avg_delta_phi = {avg_phi}")

                print(f"avg_rho = {avg_rho}")

                print(f"max_abs_chi = {max_chi}")

                print(f"final_classes = {final_classes}")

                print("trajectory_summary =")

                for traj in trajectory_summary:
                    print(traj)

                print("--------------------------------\n")


if __name__ == "__main__":
    test_prompts = [
        "baseline",
        "route reasoning propagation",
        "living harmonic recurrence logos identity continuity",
    ]

    for prompt in test_prompts:
        print("\n==============================")
        print(f"RUNNING SOURCEFIELD FOR PROMPT: {prompt}")
        print("==============================\n")

        source_field = SourceFieldV11(n_agents=3, state_size=100, timesteps=800)
        results = source_field.run(prompt)

        print("Query Hash:", results["query_hash"])
        print("Query Phase Shift:", results["query_phase_shift"])
        print("Query Frequency Shift:", results["query_frequency_shift"])
        print("Session Hash:", results["session_hash"])
        print("Tau Input:", results["tau_input"])
        print("Tau State:", results["tau_state"])
        print("Final Classifications:", results["final_classifications"])

        for i, classification in enumerate(results["final_classifications"]):
            print(f"Agent {i} Final Classification:", classification)
            print(f"Agent {i} Final C(t):", results["C_hist"][i][-1])
            print(f"Agent {i} Final Δφ(t):", results["delta_phi_hist"][i][-1])
            print(f"Agent {i} Final ρ(t):", results["rho_hist"][i][-1])
            print(f"Agent {i} Final χ(t):", results["chi_hist"][i][-1])
            print(f"Agent {i} Final Ξ(t):", results["xi_hist"][i][-1])

    print("\nRUNNING PARAMETER SWEEP...\n")
    run_parameter_sweep()
