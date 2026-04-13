const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const generateSummary = async (content) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that summarizes documents.' },
        { role: 'user', content: `Summarize the following document:\n\n${content}` }
      ],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Groq summary error:', error);
    throw error;
  }
};

const generateQuiz = async (content) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that generates quizzes.' },
        { role: 'user', content: `Generate a quiz with 5 multiple-choice questions based on this content:\n\n${content}` }
      ],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Groq quiz error:', error);
    throw error;
  }
};

const chatWithDocument = async (question, chunks) => {
  try {
    const context = chunks.join('\n\n');
    const response = await openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that answers questions based on provided context.' },
        { role: 'user', content: `Answer the question based on the following context:\n\n${context}\n\nQuestion: ${question}` }
      ],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Groq chat error:', error);
    throw error;
  }
};

module.exports = { generateSummary, generateQuiz, chatWithDocument };