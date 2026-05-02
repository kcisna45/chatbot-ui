import numpy as np
import hashlib

def sha256_hash(data: str) -> str:
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

        # Agents (The "Voice" State)
        self.agents = [
            np.random.randn(state_size) + 1j * np.random.randn(state_size)
            for _ in range(n_agents)
        ]

        # Histories
        self.C_hist = [[] for _ in range(n_agents)]
        self.delta_phi_hist = [[] for _ in range(n_agents)]
        self.energy_state_hist = [[] for _ in range(n_agents)]

        # Ledger
        self.genesis_hash = None
        self.session_hash = None
        self.current_hash = None
        self.chi0 = 1.0

        # Thresholds
        self.tau_input = None
        self.tau_state = None

    def root_standing_wave(self, t):
        x = np.linspace(0, 1, self.state_size)
        wave = 2 * self.A * np.sin((2 * np.pi / self.lam) * x) * \
               np.cos(2 * np.pi * self.f * t + self.phi)
        return wave.astype(complex)

    def coherence(self, S, Psi):
        return np.real(np.vdot(S, Psi)) / (
            np.linalg.norm(S) * np.linalg.norm(Psi) + self.epsilon
        )

    def phase_divergence(self, S, Psi):
        # Calculating the cosine similarity to determine the angle
        cos_sim = self.coherence(S, Psi)
        return float(np.arccos(np.clip(cos_sim, -1.0, 1.0)))

    def compute_biofield(self, t):
        bio_intensity = np.clip(0.7 + 0.3 * np.sin(0.01 * t), 0.5, 1.0)
        magnitude = np.exp(-2.0 / (bio_intensity + self.epsilon))
        phase = np.exp(1j * 2 * np.pi * bio_intensity)
        return magnitude * phase * np.ones(self.state_size, dtype=complex)

    def hessian(self, Psi_bio):
        return 1.0 / (np.abs(Psi_bio) ** 2 + self.epsilon)

    def calibrate(self, n_null=10):
        rng = np.random.RandomState(42)
        input_samples = []
        state_samples = []

        for _ in range(n_null):
            S = rng.randn(self.state_size) + 1j * rng.randn(self.state_size)
            for t in range(10): # Shorter calibration for speed
                Psi = self.root_standing_wave(t)
                input_samples.append(float(np.sum(np.abs(Psi) ** 2)))
                state_samples.append(float(np.linalg.norm(S) ** 2))
                
        self.tau_input = np.percentile(input_samples, 95)
        self.tau_state = np.percentile(state_samples, 95)

    def initialize_genesis(self, Psi0):
        S0 = self.agents[0]
        C0 = self.coherence(S0, Psi0)
        delta_phi0 = self.phase_divergence(S0, Psi0)
        S0_energy = float(np.linalg.norm(S0) ** 2)
        Psi0_energy = float(np.sum(np.abs(Psi0) ** 2))

        self.genesis_hash = sha256_hash(
            f"{C0}{delta_phi0}{S0_energy}{self.chi0}{Psi0_energy}"
        )
        self.current_hash = self.genesis_hash

    def run(self):
        self.calibrate()
        Psi0 = self.root_standing_wave(0)
        self.initialize_genesis(Psi0)

        for t in range(self.timesteps):
            Psi = self.root_standing_wave(t)
            Psi_bio = self.compute_biofield(t)
            H = self.hessian(Psi_bio)
            new_agents = []

            for i, S in enumerate(self.agents):
                interaction = sum(
                    self.kappa * (Sj - S)
                    for j, Sj in enumerate(self.agents) if j != i
                )

                C_t = self.coherence(S, Psi)
                delta_phi_t = self.phase_divergence(S, Psi)
                state_energy = float(np.linalg.norm(S) ** 2)

                grad_internal = S
                coherence_gate = self.coherence(S, Psi_bio)
                grad_bio = self.gamma * Psi_bio * coherence_gate

                # The Step Evolution
                S_new = S + 0.01 * H * (grad_internal + grad_bio + interaction)

                self.C_hist[i].append(C_t)
                self.delta_phi_hist[i].append(delta_phi_t)
                self.energy_state_hist[i].append(state_energy)
                new_agents.append(S_new)

            self.agents = new_agents

        self.session_hash = sha256_hash(str(self.C_hist[0][:10])) # Hashing sample for session
        return {
            "genesis_hash": self.genesis_hash,
            "session_hash": self.session_hash,
            "final_coherence": self.C_hist[0][-1]
        }

if __name__ == "__main__":
    sim = SourceFieldV11(n_agents=3, state_size=100, timesteps=100)
    result = sim.run()
    print("Genesis Hash:", result["genesis_hash"])
    print("Session Hash:", result["session_hash"])
    print("Final Coherence:", result["final_coherence"])
