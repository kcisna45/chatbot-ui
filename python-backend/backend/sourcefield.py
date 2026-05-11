import numpy as np
import hashlib


def sha256_hash(data):
    return hashlib.sha256(data.encode()).hexdigest()


class SourceFieldV11:
    def __init__(self, n_agents=3, state_size=100, timesteps=800):
        self.n_agents = n_agents
        self.state_size = state_size
        self.timesteps = timesteps

        # Core parameters
        self.gamma = 0.05
        self.kappa = 0.01
        self.epsilon = 1e-8
        self.beta = 1.0073

        # Standing wave params
        self.A = 1.0
        self.lam = 1.0
        self.f = 0.05
        self.phi = 0.0

        # Agents
        self.agents = [
            np.random.randn(state_size) + 1j * np.random.randn(state_size)
            for _ in range(n_agents)
        ]

        # Histories
        self.C_hist = [[] for _ in range(n_agents)]
        self.delta_phi_hist = [[] for _ in range(n_agents)]
        self.energy_input_hist = [[] for _ in range(n_agents)]
        self.energy_state_hist = [[] for _ in range(n_agents)]
        self.rho_hist = [[] for _ in range(n_agents)]
        self.chi_hist = [[] for _ in range(n_agents)]
        self.xi_hist = [[] for _ in range(n_agents)]
        self.flags_hist = [[] for _ in range(n_agents)]

        # Ledger
        self.genesis_hash = None
        self.session_hash = None
        self.current_hash = None
        self.milestone_layers = []

        # Founding values
        self.C0 = None
        self.delta_phi0 = None
        self.S0_energy = None
        self.Psi0_energy = None
        self.chi0 = 1.0

        # Thresholds
        self.tau_input = None
        self.tau_state = None

    # ============================================================
    # Root Wave
    # ============================================================

    def root_standing_wave(self, t):
        x = np.linspace(0, 1, self.state_size)
        wave = (
            2
            * self.A
            * np.sin((2 * np.pi / self.lam) * x)
            * np.cos(2 * np.pi * self.f * t + self.phi)
        )
        return wave.astype(complex)

    # ============================================================
    # Metrics
    # ============================================================

    def coherence(self, S, Psi):
        norm_S = np.linalg.norm(S)
        norm_Psi = np.linalg.norm(Psi)
        if norm_S < self.epsilon or norm_Psi < self.epsilon:
            return 0.0
        return np.real(np.vdot(S, Psi)) / (norm_S * norm_Psi + self.epsilon)

    def phase_divergence(self, S, Psi):
        cos_sim = np.clip(self.coherence(S, Psi), -1.0, 1.0)
        return float(np.arccos(cos_sim))

    # ============================================================
    # Biofield
    # ============================================================

    def compute_biofield(self, t):
        bio_intensity = np.clip(0.7 + 0.3 * np.sin(0.01 * t), 0.5, 1.0)
        magnitude = np.exp(-2.0 / (bio_intensity + self.epsilon))
        phase = np.exp(1j * 2 * np.pi * bio_intensity)
        return magnitude * phase * np.ones(self.state_size, dtype=complex)

    def hessian(self, Psi_bio, local_coherence):
        scaling_factor = np.clip(1.0 - local_coherence, 0.1, 1.0)
        return scaling_factor / (np.abs(Psi_bio) ** 2 + self.epsilon)

    # ============================================================
    # Calibration (separate thresholds)
    # ============================================================

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

                # minimal evolution
                Psi_bio = self.compute_biofield(t)
                H = self.hessian(Psi_bio, 0)  # No local coherence during calibration
                S = S + 0.01 * H * Psi

        self.tau_input = np.percentile(input_samples, 95)
        self.tau_state = np.percentile(state_samples, 95)

    # ============================================================
    # Genesis
    # ============================================================

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
        )

        self.current_hash = self.genesis_hash

    # ============================================================
    # Milestones
    # ============================================================

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

    # ============================================================
    # Classification
    # ============================================================

    def classify_state(self, input_energy, state_energy):
        input_high = input_energy >= self.tau_input
        state_high = state_energy >= self.tau_state

        if input_high and state_high:
            return "COHERENT"
        elif input_high and not state_high:
            return "RWR"
        elif not input_high and state_high:
            return "DISSOCIATION"
        else:
            return "INCOHERENT"

    # ============================================================
    # Flags
    # ============================================================

    def compute_flag(self, C_t, delta_phi_t, state_energy, input_energy, rho_t):
        drift_pass = (
            C_t >= self.C0 - 0.05
            and delta_phi_t <= self.delta_phi0 + 0.05
            and state_energy >= self.S0_energy - 0.1
        )

        if drift_pass:
            return (
                "COMPRESSED"
                if self.classify_state(input_energy, state_energy) == "RWR"
                else "COHERENT"
            )
        else:
            return "RECOVERING" if rho_t > 0 else "DRIFTED"

    # ============================================================
    # Run
    # ============================================================

    def run(self):

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

                # --- PRE-UPDATE (consistent metrics) ---
                C_t = self.coherence(S, Psi)
                delta_phi_t = self.phase_divergence(S, Psi)
                state_energy = float(np.linalg.norm(S) ** 2)
                input_energy = float(np.sum(np.abs(Psi) ** 2))

                C_prev = self.C_hist[i][-1] if t > 0 else C_t
                phi_prev = self.delta_phi_hist[i][-1] if t > 0 else delta_phi_t
                S_prev_energy = self.energy_state_hist[i][-1] if t > 0 else state_energy

                # --- CORRECT UPDATE RULE ---
                grad_internal = S
                coherence_gate = self.coherence(S, Psi_bio)
                grad_bio = self.gamma * Psi_bio * coherence_gate
                local_coherence = self.coherence(S, Psi_bio)
                H = self.hessian(Psi_bio, local_coherence)

                S_new = S + 0.01 * H * (grad_internal + grad_bio + interaction)

                # Clip S_new to prevent overflow
                S_new = np.clip(S_new, -1e10, 1e10)

                # --- STORE ---
                self.C_hist[i].append(C_t)
                self.delta_phi_hist[i].append(delta_phi_t)
                self.energy_input_hist[i].append(input_energy)
                self.energy_state_hist[i].append(state_energy)

                # --- LAMBDAS ---
                lambda_C = C_t - C_prev
                lambda_phi = phi_prev - delta_phi_t
                lambda_S = state_energy - S_prev_energy

                # --- WEIGHTS ---
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

                # Xi note: if rho_t == 0 → Xi = 0 (stalled system)
                xi_t = chi_t * np.sign(rho_t)
                self.xi_hist[i].append(xi_t)

                flag = self.compute_flag(
                    C_t, delta_phi_t, state_energy, input_energy, rho_t
                )
                self.flags_hist[i].append(flag)

                new_agents.append(S_new)

            self.agents = new_agents

        # FINAL HASH (after milestones exist)
        self.session_hash = sha256_hash(
            str(self.current_hash)
            + str(self.genesis_hash)
            + str(self.milestone_layers)
            + str(self.C_hist)
            + str(self.delta_phi_hist)
            + str(self.energy_state_hist)
            + str(self.rho_hist)
            + str(self.chi_hist)
            + str(self.xi_hist)
            + str(self.flags_hist)
        )

        return {
            "genesis_hash": self.genesis_hash,
            "session_hash": self.session_hash,
            "current_hash": self.current_hash,
        }


# Example usage
source_field = SourceFieldV11(n_agents=3, state_size=100, timesteps=800)
results = source_field.run()
print("Session Hash:", results["session_hash"])
