// Server-only LLM provider configuration.
// Each entry: name (display), url, model, envKey (Vercel env var),
// body(model, prompt) -> request payload, optional extraHeaders(),
// extract(data) -> assistant text.

module.exports = {
  groq: {
    name: 'Groq',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    envKey: 'GROQ_API_KEY',
    body: (model, prompt) => ({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 1.1,
      max_tokens: 700
    }),
    extract: (data) =>
      (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || ''
  },
  m3: {
    name: 'M3',
    url: 'https://api.MiniMax.chat/v1/text/chatcompletion_v2',
    model: 'M3',
    envKey: 'M3_API_KEY',
    body: (model, prompt) => ({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 1.1,
      max_tokens: 700
    }),
    extract: (data) => {
      if (data.base_resp && data.base_resp.status_code !== undefined && data.base_resp.status_code !== 0) {
        throw new Error('M3 ' + data.base_resp.status_code + ': ' + (data.base_resp.status_msg || 'unknown'));
      }
      return (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
    }
  },
  openrouter: {
    name: 'OpenRouter (M3)',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'minimax/minimax-m3',
    envKey: 'OPENROUTER_API_KEY',
    body: (model, prompt) => ({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 1.1,
      max_tokens: 700
    }),
    extraHeaders: () => ({
      'HTTP-Referer': 'https://k-life-os.kosatiks-group.pp.ua',
      'X-Title': 'K Life OS'
    }),
    extract: (data) =>
      (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || ''
  }
};
