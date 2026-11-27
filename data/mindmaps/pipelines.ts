import type { Localized } from '@/lib/content/types';
import { L, C } from './types';

/**
 * Step-through training pipelines shown under a mind map (components/materials/PipelineLab.tsx): models, data and the
 * calculation nodes that turn their outputs into a number, with one worked example per pipeline. The numbers are a
 * single illustrative example chosen so the arithmetic can be checked by hand; they are not measurements.
 */
export type PipeKind = 'data' | 'model' | 'frozen' | 'human' | 'verifier' | 'op' | 'loss' | 'update';
export interface PipeNode { id: string; kind: PipeKind; col: number; row: number; label: Localized<string>; /** Value shown on the card once its step is reached. */ value?: string; note: Localized<string> }
export interface PipeEdge { from: string; to: string; label?: Localized<string> }
export interface PipeStep { title: Localized<string>; text: Localized<string>; /** Nodes lit in this step; the first one is the node computed in this step. */ nodes: string[]; /** Formula lines with the worked numbers; the same in both languages. */ calc: string[] }
export interface Pipeline { id: string; tab: Localized<string>; title: Localized<string>; intro: Localized<string>; nodes: PipeNode[]; edges: PipeEdge[]; steps: PipeStep[] }

const sft: Pipeline = {
  id: 'sft', tab: C('SFT'),
  title: L('Supervised fine-tuning: one training step', 'Ajuste fino supervisado: un paso de entrenamiento'),
  intro: L('The model learns to copy good answers. Only the answer tokens count in the loss; the prompt is context.', 'El modelo aprende a copiar buenas respuestas. Solo los tokens de la respuesta cuentan en la pérdida; el prompt es contexto.'),
  nodes: [
    { id: 'data', kind: 'data', col: 0, row: 0, label: L('Prompt + answer (x, y)', 'Prompt + respuesta (x, y)'), value: 'x = "2 + 3 = ?", y = "5"', note: L('A demonstration written or approved by a person: the answer the model should give.', 'Una demostración escrita o aprobada por una persona: la respuesta que el modelo debería dar.') },
    { id: 'tok', kind: 'op', col: 1, row: 0, label: L('Tokenise + mask prompt', 'Tokenizar + enmascarar prompt'), value: 'mask = [0 0 0 0 1]', note: L('The chat template joins prompt and answer; prompt tokens get mask 0 so they add nothing to the loss.', 'La plantilla de chat une prompt y respuesta; los tokens del prompt reciben máscara 0 y no suman a la pérdida.') },
    { id: 'pol', kind: 'model', col: 2, row: 0, label: L('Policy π_θ (the LLM)', 'Política π_θ (el LLM)'), value: 'logits z', note: L('The model being trained. With teacher forcing it sees the true previous tokens and predicts the next one.', 'El modelo que se entrena. Con teacher forcing ve los tokens anteriores reales y predice el siguiente.') },
    { id: 'soft', kind: 'op', col: 3, row: 0, label: C('softmax → p(y_t)'), value: 'p("5") = 0.70', note: L('Turns the scores of every vocabulary token into probabilities; we read the probability of the correct token.', 'Convierte las puntuaciones de cada token del vocabulario en probabilidades; leemos la del token correcto.') },
    { id: 'loss', kind: 'loss', col: 4, row: 0, label: L('Cross-entropy loss', 'Pérdida de entropía cruzada'), value: 'L = 0.357', note: L('Negative log-probability of the correct token, averaged over answer tokens. Lower is better.', 'Log-probabilidad negativa del token correcto, promediada sobre los tokens de la respuesta. Cuanto menor, mejor.') },
    { id: 'upd', kind: 'update', col: 4, row: 1, label: L('Backprop + optimiser', 'Backprop + optimizador'), value: 'θ ← θ − η∇L', note: L('Gradients flow back through the network and the optimiser (usually AdamW) nudges every weight, or only the LoRA adapters.', 'Los gradientes recorren la red hacia atrás y el optimizador (normalmente AdamW) ajusta cada peso, o solo los adaptadores LoRA.') },
  ],
  edges: [
    { from: 'data', to: 'tok', label: L('text', 'texto') }, { from: 'tok', to: 'pol', label: L('tokens', 'tokens') },
    { from: 'pol', to: 'soft', label: C('logits') }, { from: 'soft', to: 'loss', label: C('p(y_t)') },
    { from: 'loss', to: 'upd', label: C('∇L') }, { from: 'upd', to: 'pol', label: L('new θ', 'nuevo θ') },
  ],
  steps: [
    { nodes: ['data'], title: L('Take a demonstration', 'Toma una demostración'), text: L('One training example: a prompt and the answer we want.', 'Un ejemplo de entrenamiento: un prompt y la respuesta que queremos.'), calc: ['x = "2 + 3 = ?"', 'y = "5"'] },
    { nodes: ['tok', 'data'], title: L('Tokenise and mask the prompt', 'Tokeniza y enmascara el prompt'), text: L('Only the answer is learned; the prompt tokens are context.', 'Solo se aprende la respuesta; los tokens del prompt son contexto.'), calc: ['tokens = ["2", "+", "3", "= ?", "5"]', 'mask   = [ 0,   0,   0,    0,   1 ]'] },
    { nodes: ['pol', 'tok'], title: L('Forward pass', 'Pasada hacia delante'), text: L('The policy scores every vocabulary token for the next position.', 'La política puntúa cada token del vocabulario para la siguiente posición.'), calc: ['z = f_θ(x, y_<t)   (one score per vocabulary token)'] },
    { nodes: ['soft', 'pol'], title: L('Probability of the right token', 'Probabilidad del token correcto'), text: L('Softmax turns scores into probabilities.', 'Softmax convierte las puntuaciones en probabilidades.'), calc: ['p(y_t) = exp(z_y) / Σ_j exp(z_j)', 'p("5") = 0.70'] },
    { nodes: ['loss', 'soft'], title: L('Cross-entropy loss', 'Pérdida de entropía cruzada'), text: L('The loss is small when the model is confident and right.', 'La pérdida es pequeña cuando el modelo acierta con seguridad.'), calc: ['L_SFT = −(1/T) Σ_t mask_t · log p(y_t | x, y_<t)', 'L = −log 0.70 = 0.357'] },
    { nodes: ['upd', 'loss', 'pol'], title: L('Update the weights', 'Actualiza los pesos'), text: L('After the update p("5") rises and the loss falls; repeat over the dataset for 1 to 3 epochs.', 'Tras la actualización p("5") sube y la pérdida baja; se repite sobre el dataset de 1 a 3 épocas.'), calc: ['θ ← θ − η · ∇_θ L', 'LoRA: W′ = W + B·A  (only A and B train)'] },
  ],
};

const rm: Pipeline = {
  id: 'rm', tab: L('Reward model', 'Modelo de recompensa'),
  title: L('Training the reward model from human preferences', 'Entrenar el modelo de recompensa con preferencias humanas'),
  intro: L('People compare two answers; the reward model learns to give the preferred one a higher score (Bradley–Terry).', 'Las personas comparan dos respuestas; el modelo de recompensa aprende a puntuar más alta la preferida (Bradley–Terry).'),
  nodes: [
    { id: 'x', kind: 'data', col: 0, row: 0, label: L('Prompt x', 'Prompt x'), value: '"Explain KL"', note: L('A prompt from the preference dataset.', 'Un prompt del dataset de preferencias.') },
    { id: 'pol', kind: 'frozen', col: 1, row: 0, label: L('SFT model', 'Modelo SFT'), value: 'y_A, y_B', note: L('The fine-tuned model samples two (or more) answers to compare.', 'El modelo ajustado genera dos (o más) respuestas para comparar.') },
    { id: 'hum', kind: 'human', col: 2, row: 0, label: L('Human labeler', 'Anotador humano'), value: 'y_w = y_A', note: L('Picks the better answer: chosen y_w, rejected y_l. No absolute scores, only a comparison.', 'Elige la mejor respuesta: elegida y_w, rechazada y_l. Sin notas absolutas, solo una comparación.') },
    { id: 'rmod', kind: 'model', col: 3, row: 0, label: L('Reward model r_φ', 'Modelo de recompensa r_φ'), value: 'r_w = 1.2, r_l = 0.4', note: L('An LLM with a scalar head on the last token: reads (x, y) and outputs one number.', 'Un LLM con una cabeza escalar en el último token: lee (x, y) y devuelve un número.') },
    { id: 'diff', kind: 'op', col: 4, row: 0, label: C('r_w − r_l'), value: 'Δ = 0.8', note: L('Only the difference of the two scores matters, so the scale of r is arbitrary.', 'Solo importa la diferencia de las dos puntuaciones, así que la escala de r es arbitraria.') },
    { id: 'sig', kind: 'op', col: 5, row: 0, label: C('σ(Δ)'), value: 'P = 0.69', note: L('The sigmoid turns the score gap into the probability that y_w is preferred.', 'La sigmoide convierte la diferencia en la probabilidad de que se prefiera y_w.') },
    { id: 'loss', kind: 'loss', col: 5, row: 1, label: L('Pairwise loss', 'Pérdida por pares'), value: 'L = 0.371', note: L('Negative log of that probability: small when the model agrees with the human.', 'Logaritmo negativo de esa probabilidad: pequeño cuando el modelo coincide con la persona.') },
    { id: 'upd', kind: 'update', col: 3, row: 1, label: L('Update φ', 'Actualiza φ'), value: 'φ ← φ − η∇L', note: L('Backprop raises r_w and lowers r_l for similar answers.', 'El backprop sube r_w y baja r_l en respuestas parecidas.') },
  ],
  edges: [
    { from: 'x', to: 'pol' }, { from: 'pol', to: 'hum', label: L('2 answers', '2 respuestas') }, { from: 'hum', to: 'rmod', label: C('y_w, y_l') },
    { from: 'rmod', to: 'diff', label: C('r_w, r_l') }, { from: 'diff', to: 'sig', label: C('Δ') }, { from: 'sig', to: 'loss', label: C('P') },
    { from: 'loss', to: 'upd', label: C('∇L') }, { from: 'upd', to: 'rmod', label: L('new φ', 'nuevo φ') },
  ],
  steps: [
    { nodes: ['pol', 'x'], title: L('Sample two answers', 'Genera dos respuestas'), text: L('The SFT model answers the same prompt twice.', 'El modelo SFT responde dos veces al mismo prompt.'), calc: ['y_A, y_B ~ π_SFT(· | x)'] },
    { nodes: ['hum', 'pol'], title: L('A person compares them', 'Una persona las compara'), text: L('The labeler marks which answer is better.', 'El anotador marca qué respuesta es mejor.'), calc: ['y_w = y_A  (chosen)', 'y_l = y_B  (rejected)'] },
    { nodes: ['rmod', 'hum'], title: L('Score both answers', 'Puntúa ambas respuestas'), text: L('The reward model gives each answer one number.', 'El modelo de recompensa da un número a cada respuesta.'), calc: ['r_w = r_φ(x, y_w) = 1.2', 'r_l = r_φ(x, y_l) = 0.4'] },
    { nodes: ['diff', 'rmod'], title: L('Take the difference', 'Calcula la diferencia'), text: L('The model should score the chosen answer higher.', 'El modelo debería puntuar más alta la respuesta elegida.'), calc: ['Δ = r_w − r_l = 1.2 − 0.4 = 0.8'] },
    { nodes: ['sig', 'diff'], title: L('Probability the human agrees (Bradley–Terry)', 'Probabilidad de coincidir con la persona (Bradley–Terry)'), text: L('A sigmoid of the gap.', 'Una sigmoide de la diferencia.'), calc: ['P(y_w ≻ y_l) = σ(Δ) = 1 / (1 + e^−0.8) = 0.69'] },
    { nodes: ['loss', 'sig'], title: L('Pairwise loss', 'Pérdida por pares'), text: L('Low when the reward model already prefers y_w.', 'Baja cuando el modelo de recompensa ya prefiere y_w.'), calc: ['L_RM = −log σ(r_w − r_l)', 'L = −log 0.69 = 0.371'] },
    { nodes: ['upd', 'loss', 'rmod'], title: L('Update the reward model', 'Actualiza el modelo de recompensa'), text: L('Over many pairs the reward model learns what people prefer; it is then frozen and used by PPO.', 'Con muchos pares aprende lo que prefieren las personas; después se congela y lo usa PPO.'), calc: ['φ ← φ − η · ∇_φ L_RM'] },
  ],
};

const ppoNodes = (rewardFirst: { id: string; kind: PipeKind; label: Localized<string>; value: string; note: Localized<string> }, ex: { klv: string; rt: string; v: string; a: string; ratio: string; clip: string; loss: string }): PipeNode[] => [
  { id: 'x', kind: 'data', col: 0, row: 1, label: L('Prompt x', 'Prompt x'), value: ex === RLVR_EX ? '"2 + 3 = ?"' : '"Explain KL"', note: L('A prompt from the RL dataset; no reference answer is needed for RLHF.', 'Un prompt del dataset de RL; RLHF no necesita respuesta de referencia.') },
  { id: 'pol', kind: 'model', col: 1, row: 1, label: L('Policy π_θ', 'Política π_θ'), value: 'log π_θ(y|x)', note: L('The model being trained, initialised from the SFT model.', 'El modelo que se entrena, iniciado desde el modelo SFT.') },
  { id: 'y', kind: 'data', col: 2, row: 1, label: L('Answer y (rollout)', 'Respuesta y (rollout)'), value: ex === RLVR_EX ? 'y = "5"' : 'y = 120 tokens', note: L('The generated answer, with the log-probabilities of every token stored as π_old.', 'La respuesta generada, con la log-probabilidad de cada token guardada como π_old.') },
  { id: 'rw', kind: rewardFirst.kind, col: 3, row: 0, label: rewardFirst.label, value: rewardFirst.value, note: rewardFirst.note },
  { id: 'ref', kind: 'frozen', col: 3, row: 1, label: L('Reference π_ref', 'Referencia π_ref'), value: ex.klv, note: L('A frozen copy of the SFT model. The KL term stops the policy drifting far from it (and from fluent language).', 'Una copia congelada del modelo SFT. El término KL impide que la política se aleje demasiado (y del lenguaje fluido).') },
  { id: 'crit', kind: 'model', col: 3, row: 2, label: L('Critic V_ψ', 'Crítico V_ψ'), value: ex.v, note: L('A value model that predicts the reward the policy usually gets for this prompt: the baseline.', 'Un modelo de valor que predice la recompensa que suele obtener la política con este prompt: la línea base.') },
  { id: 'kl', kind: 'op', col: 4, row: 0, label: C('r − β·KL'), value: ex.rt, note: L('Reward minus the KL penalty; β (0.1 here) sets how hard the policy is pulled back.', 'Recompensa menos la penalización KL; β (0,1 aquí) fija cuánto se frena a la política.') },
  { id: 'adv', kind: 'op', col: 5, row: 1, label: L('Advantage Â', 'Ventaja Â'), value: ex.a, note: L('How much better than expected the answer was. Positive: make it more likely; negative: less likely.', 'Cuánto mejor de lo esperado fue la respuesta. Positiva: hacerla más probable; negativa: menos.') },
  { id: 'ratio', kind: 'op', col: 2, row: 3, label: C('ρ = π_θ / π_old'), value: ex.ratio, note: L('How much the updated policy changed the probability of this answer since it was sampled.', 'Cuánto ha cambiado la política actualizada la probabilidad de esta respuesta desde que se generó.') },
  { id: 'clip', kind: 'op', col: 6, row: 3, label: L('PPO clip', 'Recorte PPO'), value: ex.clip, note: L('Limits each update to a ratio of 1 ± ε (ε = 0.2) so one batch cannot push the policy too far.', 'Limita cada actualización a un ratio de 1 ± ε (ε = 0,2) para que un lote no empuje demasiado la política.') },
  { id: 'loss', kind: 'loss', col: 7, row: 3, label: L('Policy + value loss', 'Pérdida de política + valor'), value: ex.loss, note: L('Policy loss is minus the clipped objective; the critic learns from (R − V)².', 'La pérdida de política es menos el objetivo recortado; el crítico aprende de (R − V)².') },
  { id: 'upd', kind: 'update', col: 7, row: 2, label: L('Backprop θ and ψ', 'Backprop de θ y ψ'), value: 'θ, ψ updated', note: L('Gradients update the policy and the critic; the reward model (or verifier) and the reference stay frozen.', 'Los gradientes actualizan la política y el crítico; el modelo de recompensa (o el verificador) y la referencia siguen congelados.') },
];
const RLHF_EX = { klv: 'KL = 0.5', rt: 'r_total = 0.75', v: 'V = 0.60', a: 'Â = +0.15', ratio: 'ρ = 1.30', clip: '0.180', loss: 'L = −0.180' };
const RLVR_EX = { klv: 'KL = 0.3', rt: 'r_total = 0.97', v: 'V = 0.70', a: 'Â = +0.27', ratio: 'ρ = 0.90', clip: '0.243', loss: 'L = −0.243' };
const ppoEdges = (rwLabel: Localized<string>): PipeEdge[] => [
  { from: 'x', to: 'pol' }, { from: 'pol', to: 'y', label: L('generate', 'genera') },
  { from: 'y', to: 'rw', label: rwLabel }, { from: 'y', to: 'ref', label: C('log π') }, { from: 'y', to: 'crit', label: L('state', 'estado') },
  { from: 'rw', to: 'kl', label: C('r') }, { from: 'ref', to: 'kl', label: C('KL') },
  { from: 'kl', to: 'adv', label: C('R') }, { from: 'crit', to: 'adv', label: C('V') },
  { from: 'y', to: 'ratio', label: C('π_old') }, { from: 'adv', to: 'clip', label: C('Â') }, { from: 'ratio', to: 'clip', label: C('ρ') },
  { from: 'clip', to: 'loss' }, { from: 'loss', to: 'upd', label: C('∇L') },
  { from: 'upd', to: 'pol', label: L('new θ, ψ', 'nuevos θ, ψ') },
];

const rlhf: Pipeline = {
  id: 'rlhf', tab: L('RLHF (PPO)', 'RLHF (PPO)'),
  title: L('RLHF with PPO: one update, four models', 'RLHF con PPO: una actualización, cuatro modelos'),
  intro: L('The policy answers, the frozen reward model scores it, the KL term keeps it close to the SFT model, the critic supplies the baseline and PPO clips the update.', 'La política responde, el modelo de recompensa congelado puntúa, el término KL la mantiene cerca del modelo SFT, el crítico aporta la línea base y PPO recorta la actualización.'),
  nodes: ppoNodes({ id: 'rw', kind: 'frozen', label: L('Reward model r_φ', 'Modelo de recompensa r_φ'), value: 'r = 0.80', note: L('Trained on human preferences, then frozen. Its score is a learned, subjective judgement (like 8/10).', 'Entrenado con preferencias humanas y después congelado. Su nota es un juicio aprendido y subjetivo (como un 8/10).') }, RLHF_EX),
  edges: ppoEdges(L('score', 'puntúa')),
  steps: [
    { nodes: ['y', 'x', 'pol'], title: L('Roll out an answer', 'Genera una respuesta'), text: L('The current policy answers the prompt; its log-probabilities are stored as π_old.', 'La política actual responde al prompt; sus log-probabilidades se guardan como π_old.'), calc: ['y ~ π_θ(· | x)', 'log π_old(y | x) = −12.1'] },
    { nodes: ['rw', 'y'], title: L('Reward model scores it', 'El modelo de recompensa puntúa'), text: L('One scalar for the whole answer, given at the last token.', 'Un escalar para toda la respuesta, en el último token.'), calc: ['r = r_φ(x, y) = 0.80'] },
    { nodes: ['ref', 'y'], title: L('Reference model: how far did we drift?', 'Modelo de referencia: ¿cuánto nos alejamos?'), text: L('The frozen SFT model scores the same tokens.', 'El modelo SFT congelado puntúa los mismos tokens.'), calc: ['log π_ref(y | x) = −12.6', 'KL ≈ log π_θ − log π_ref = −12.1 − (−12.6) = 0.5'] },
    { nodes: ['kl', 'rw', 'ref'], title: L('Reward with KL penalty', 'Recompensa con penalización KL'), text: L('Drifting away costs reward, so the policy cannot exploit the reward model with strange text.', 'Alejarse cuesta recompensa, así que la política no puede engañar al modelo de recompensa con texto extraño.'), calc: ['r_total = r − β · KL', '        = 0.80 − 0.1 × 0.5 = 0.75'] },
    { nodes: ['crit', 'x'], title: L('Critic predicts the baseline', 'El crítico predice la línea base'), text: L('What reward does the policy usually get here?', '¿Qué recompensa suele obtener la política aquí?'), calc: ['V_ψ(x) = 0.60'] },
    { nodes: ['adv', 'kl', 'crit'], title: L('Advantage', 'Ventaja'), text: L('Better than expected, so this answer should become more likely. Per token, GAE spreads this over the sequence.', 'Mejor de lo esperado, así que esta respuesta debe ser más probable. Por token, GAE lo reparte a lo largo de la secuencia.'), calc: ['Â = R − V = 0.75 − 0.60 = +0.15', 'per token: δ_t = r_t + γ·V(s_t+1) − V(s_t)', '           Â_t = Σ_l (γλ)^l · δ_t+l'] },
    { nodes: ['ratio', 'y', 'pol'], title: L('Probability ratio', 'Ratio de probabilidades'), text: L('PPO reuses the batch for several gradient steps; after a few, the policy has moved.', 'PPO reutiliza el lote en varios pasos de gradiente; tras algunos, la política se ha movido.'), calc: ['ρ = exp(log π_θ − log π_old) = exp(0.262) = 1.30'] },
    { nodes: ['clip', 'adv', 'ratio'], title: L('Clip the update', 'Recorta la actualización'), text: L('With ε = 0.2 the ratio counts at most 1.2, so the gain from this answer is capped.', 'Con ε = 0,2 el ratio cuenta como máximo 1,2, así que la ganancia de esta respuesta queda limitada.'), calc: ['clip(1.30, 1 − 0.2, 1 + 0.2) = 1.20', 'L_CLIP = min(ρ·Â, clip(ρ)·Â)', '       = min(1.30 × 0.15, 1.20 × 0.15) = min(0.195, 0.180) = 0.180'] },
    { nodes: ['loss', 'clip', 'kl', 'crit'], title: L('Losses', 'Pérdidas'), text: L('Minimise minus the objective; the critic learns the real return.', 'Se minimiza menos el objetivo; el crítico aprende el retorno real.'), calc: ['L_policy = −0.180', 'L_value  = (R − V)² = (0.75 − 0.60)² = 0.0225', 'L = L_policy + c₁·L_value − c₂·entropy'] },
    { nodes: ['upd', 'loss', 'pol', 'crit'], title: L('Backpropagate', 'Backpropagation'), text: L('Policy and critic are updated; reward model and reference stay frozen. Four models sit in memory.', 'Se actualizan la política y el crítico; el modelo de recompensa y la referencia siguen congelados. Hay cuatro modelos en memoria.'), calc: ['θ ← θ − η · ∇_θ L_policy', 'ψ ← ψ − η · ∇_ψ L_value'] },
  ],
};

const rlvr: Pipeline = {
  id: 'rlvr', tab: C('RLVR'),
  title: L('RLVR: the same PPO loop, a verifier instead of a reward model', 'RLVR: el mismo bucle PPO, con un verificador en lugar del modelo de recompensa'),
  intro: L('Only the reward source changes: code checks the answer and returns 1 or 0. No human labels and no learned reward model; returns, critic, advantage and clipping stay the same.', 'Solo cambia la fuente de la recompensa: un código comprueba la respuesta y devuelve 1 o 0. Sin anotaciones humanas ni modelo de recompensa aprendido; retornos, crítico, ventaja y recorte siguen igual.'),
  nodes: ppoNodes({ id: 'rw', kind: 'verifier', label: L('Verifier (code)', 'Verificador (código)'), value: 'r = 1', note: L('A program, test suite or checker: recompute the maths, run unit tests, execute SQL, validate a JSON schema. Objective and cheap.', 'Un programa, una batería de tests o un comprobador: recalcular, ejecutar tests unitarios, ejecutar SQL, validar un esquema JSON. Objetivo y barato.') }, RLVR_EX),
  edges: ppoEdges(L('check', 'comprueba')),
  steps: [
    { nodes: ['y', 'x', 'pol'], title: L('Roll out an answer', 'Genera una respuesta'), text: L('Prompts come with a way to check the answer (a known result or tests).', 'Los prompts vienen con una forma de comprobar la respuesta (un resultado conocido o tests).'), calc: ['y ~ π_θ(· | x)  →  "5"'] },
    { nodes: ['rw', 'y'], title: L('Verifier checks it', 'El verificador lo comprueba'), text: L('Deterministic code returns 1 for correct, 0 for wrong (or a partial score if designed that way).', 'Un código determinista devuelve 1 si es correcta y 0 si no (o una nota parcial si se diseña así).'), calc: ['def verify(solution):', '    tests = [(solution(2, 3), 5), (solution(10, 5), 15), (solution(-1, 1), 0)]', '    return int(all(a == e for a, e in tests))', 'r = int("5" == "5") = 1'] },
    { nodes: ['ref', 'y'], title: L('Reference model', 'Modelo de referencia'), text: L('Same KL as RLHF; many RLVR recipes keep a small β or none.', 'El mismo KL que en RLHF; muchas recetas de RLVR usan un β pequeño o ninguno.'), calc: ['KL ≈ log π_θ − log π_ref = 0.3'] },
    { nodes: ['kl', 'rw', 'ref'], title: L('Reward with KL penalty', 'Recompensa con penalización KL'), text: L('', ''), calc: ['r_total = 1 − 0.1 × 0.3 = 0.97'] },
    { nodes: ['crit', 'x'], title: L('Critic baseline', 'Línea base del crítico'), text: L('The critic predicts the chance the policy solves this prompt.', 'El crítico predice la probabilidad de que la política resuelva este prompt.'), calc: ['V_ψ(x) = 0.70'] },
    { nodes: ['adv', 'kl', 'crit'], title: L('Advantage', 'Ventaja'), text: L('A correct answer on a prompt the model often fails gets a big positive advantage.', 'Una respuesta correcta en un prompt que el modelo suele fallar recibe una gran ventaja positiva.'), calc: ['Â = 0.97 − 0.70 = +0.27'] },
    { nodes: ['ratio', 'y', 'pol'], title: L('Probability ratio', 'Ratio de probabilidades'), text: L('Inside the clip range this time.', 'Esta vez dentro del rango de recorte.'), calc: ['ρ = 0.90  (inside 0.8 … 1.2)'] },
    { nodes: ['clip', 'adv', 'ratio'], title: L('Clip (no effect here)', 'Recorte (sin efecto aquí)'), text: L('The ratio is within 1 ± 0.2, so the clip changes nothing.', 'El ratio está dentro de 1 ± 0,2, así que el recorte no cambia nada.'), calc: ['min(0.90 × 0.27, clip(0.90) × 0.27) = 0.243'] },
    { nodes: ['loss', 'clip', 'kl', 'crit'], title: L('Losses', 'Pérdidas'), text: L('', ''), calc: ['L_policy = −0.243', 'L_value  = (0.97 − 0.70)² = 0.0729'] },
    { nodes: ['upd', 'loss', 'pol', 'crit'], title: L('Backpropagate', 'Backpropagation'), text: L('Three models in memory instead of four: policy, reference and critic. The verifier is just code.', 'Tres modelos en memoria en lugar de cuatro: política, referencia y crítico. El verificador es solo código.'), calc: ['θ ← θ − η · ∇_θ L_policy', 'ψ ← ψ − η · ∇_ψ L_value'] },
  ],
};

const grpo: Pipeline = {
  id: 'grpo', tab: C('GRPO'),
  title: L('GRPO: no critic, the group is the baseline', 'GRPO: sin crítico, el grupo es la línea base'),
  intro: L('Sample several answers to the same prompt, score them (often with a verifier, as in DeepSeek-R1), and compare each with the group average. No value model to train or hold in memory.', 'Genera varias respuestas al mismo prompt, puntúalas (a menudo con un verificador, como en DeepSeek-R1) y compara cada una con la media del grupo. Sin modelo de valor que entrenar ni guardar en memoria.'),
  nodes: [
    { id: 'x', kind: 'data', col: 0, row: 1, label: L('Prompt x', 'Prompt x'), value: '"2 + 3 = ?"', note: L('One prompt, several samples.', 'Un prompt, varias muestras.') },
    { id: 'pol', kind: 'model', col: 1, row: 1, label: L('Policy π_θ', 'Política π_θ'), value: 'G = 4 samples', note: L('The model being trained.', 'El modelo que se entrena.') },
    { id: 'grp', kind: 'data', col: 2, row: 1, label: L('Group of answers', 'Grupo de respuestas'), value: '"5" "6" "5" "5"', note: L('G answers to the same prompt (G = 4 here; papers use 16 or 64).', 'G respuestas al mismo prompt (G = 4 aquí; los artículos usan 16 o 64).') },
    { id: 'ver', kind: 'verifier', col: 3, row: 0, label: L('Verifier / reward', 'Verificador / recompensa'), value: 'r = [1, 0, 1, 1]', note: L('Rule-based check or a reward model; one score per answer.', 'Comprobación por reglas o un modelo de recompensa; una nota por respuesta.') },
    { id: 'ref', kind: 'frozen', col: 3, row: 2, label: L('Reference π_ref', 'Referencia π_ref'), value: 'KL term', note: L('Frozen SFT copy; in GRPO the KL goes straight into the loss, not into the reward.', 'Copia SFT congelada; en GRPO el KL va directamente a la pérdida, no a la recompensa.') },
    { id: 'norm', kind: 'op', col: 4, row: 0, label: L('Group mean and std', 'Media y desviación del grupo'), value: 'μ = 0.75, σ = 0.433', note: L('The group statistics replace the critic as the baseline.', 'Las estadísticas del grupo sustituyen al crítico como línea base.') },
    { id: 'adv', kind: 'op', col: 5, row: 1, label: L('Advantage per answer', 'Ventaja por respuesta'), value: '[+0.58, −1.73, +0.58, +0.58]', note: L('Above-average answers are pushed up, below-average ones down.', 'Las respuestas por encima de la media se refuerzan y las de debajo se penalizan.') },
    { id: 'clip', kind: 'op', col: 6, row: 1, label: L('Clipped objective', 'Objetivo recortado'), value: 'ρ·Â (ρ = 1)', note: L('The same PPO clip, applied to every token of every answer.', 'El mismo recorte de PPO, aplicado a cada token de cada respuesta.') },
    { id: 'kl', kind: 'op', col: 6, row: 2, label: C('β · D_KL'), value: 'β = 0.04', note: L('Penalty for drifting from the reference, subtracted in the objective.', 'Penalización por alejarse de la referencia, restada en el objetivo.') },
    { id: 'loss', kind: 'loss', col: 7, row: 1, label: L('GRPO loss', 'Pérdida GRPO'), value: 'L = −J', note: L('Minus the average of clipped objective minus β·KL.', 'Menos la media del objetivo recortado menos β·KL.') },
    { id: 'upd', kind: 'update', col: 7, row: 2, label: L('Backprop θ', 'Backprop de θ'), value: 'θ updated', note: L('Only the policy trains: two models in memory (policy and reference).', 'Solo se entrena la política: dos modelos en memoria (política y referencia).') },
  ],
  edges: [
    { from: 'x', to: 'pol' }, { from: 'pol', to: 'grp', label: L('G samples', 'G muestras') }, { from: 'grp', to: 'ver', label: L('check', 'comprueba') },
    { from: 'grp', to: 'ref', label: C('log π') }, { from: 'ver', to: 'norm', label: C('r_i') }, { from: 'norm', to: 'adv', label: C('μ, σ') },
    { from: 'adv', to: 'clip', label: C('Â_i') }, { from: 'ref', to: 'kl', label: C('KL') }, { from: 'clip', to: 'loss' }, { from: 'kl', to: 'loss' },
    { from: 'loss', to: 'upd', label: C('∇L') }, { from: 'upd', to: 'pol', label: L('new θ', 'nuevo θ') },
  ],
  steps: [
    { nodes: ['grp', 'x', 'pol'], title: L('Sample a group', 'Genera un grupo'), text: L('Several answers to the same prompt.', 'Varias respuestas al mismo prompt.'), calc: ['y_1 … y_G ~ π_θ(· | x),  G = 4', 'answers = ["5", "6", "5", "5"]'] },
    { nodes: ['ver', 'grp'], title: L('Score every answer', 'Puntúa cada respuesta'), text: L('The verifier returns 1 for correct answers.', 'El verificador devuelve 1 para las respuestas correctas.'), calc: ['r = [1, 0, 1, 1]'] },
    { nodes: ['norm', 'ver'], title: L('Group statistics', 'Estadísticas del grupo'), text: L('The mean is the baseline the critic used to provide.', 'La media es la línea base que antes daba el crítico.'), calc: ['μ = (1 + 0 + 1 + 1) / 4 = 0.75', 'σ = √(((0.25)² × 3 + (0.75)²) / 4) = 0.433'] },
    { nodes: ['adv', 'norm'], title: L('Group-relative advantage', 'Ventaja relativa al grupo'), text: L('The wrong answer gets a strong negative signal; the right ones a small positive one.', 'La respuesta errónea recibe una señal negativa fuerte; las correctas, una positiva pequeña.'), calc: ['Â_i = (r_i − μ) / σ', 'Â = [(1 − 0.75)/0.433, (0 − 0.75)/0.433, …] = [+0.58, −1.73, +0.58, +0.58]'] },
    { nodes: ['clip', 'adv'], title: L('Clipped objective', 'Objetivo recortado'), text: L('On the first gradient step ρ = 1, so the objective is just Â.', 'En el primer paso de gradiente ρ = 1, así que el objetivo es simplemente Â.'), calc: ['J_i = min(ρ·Â_i, clip(ρ, 1 − ε, 1 + ε)·Â_i)', 'ρ = 1  →  J = Â = [+0.58, −1.73, +0.58, +0.58]'] },
    { nodes: ['kl', 'ref'], title: L('KL to the reference', 'KL respecto a la referencia'), text: L('Subtracted inside the objective rather than from the reward.', 'Se resta dentro del objetivo en lugar de en la recompensa.'), calc: ['J_GRPO = (1/G) Σ_i (1/|y_i|) Σ_t [ J_i,t − β · D_KL(π_θ ‖ π_ref) ]', 'β = 0.04 (DeepSeekMath)'] },
    { nodes: ['loss', 'clip', 'kl'], title: L('Loss', 'Pérdida'), text: L('Mean of the four objectives with ρ = 1 and KL ≈ 0 at the start.', 'Media de los cuatro objetivos con ρ = 1 y KL ≈ 0 al principio.'), calc: ['mean(J) = (0.58 − 1.73 + 0.58 + 0.58) / 4 ≈ 0.00', 'L = −J_GRPO  (gradients still flow: each answer is pushed by its own Â_i)'] },
    { nodes: ['upd', 'loss', 'pol'], title: L('Update only the policy', 'Actualiza solo la política'), text: L('No critic to train: about half the memory of PPO, which is why DeepSeek-R1 used it for reasoning RL.', 'Sin crítico que entrenar: cerca de la mitad de memoria que PPO, por eso DeepSeek-R1 lo usó para el RL de razonamiento.'), calc: ['θ ← θ − η · ∇_θ L'] },
  ],
};

/** Map id → its step-through pipelines (only maps that have some). */
export const pipelinesByMap: Record<string, Pipeline[]> = { posttrain: [sft, rm, rlhf, rlvr, grpo] };
