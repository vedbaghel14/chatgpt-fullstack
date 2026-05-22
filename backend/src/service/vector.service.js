// Import the Pinecone library
const  { Pinecone }  = require('@pinecone-database/pinecone')

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey:process.env.PINECONE_API_KEY });

const chatgptIndex = pc.Index('chatgpt')

function validateVector(vector) {
  if (!Array.isArray(vector) || vector.length === 0) {
    throw new Error('Vector is empty or invalid. Cannot upsert to Pinecone.')
  }
}

async function creatememory({vector, messageId, metadata}) {
  validateVector(vector)
  if (!messageId) {
    throw new Error('messageId is required for Pinecone upsert.')
  }

  await chatgptIndex.upsert({
    records: [
      {
        id: String(messageId),
        values: vector,
        metadata: metadata,
      },
    ],
  })
}

async function querymemory({vector, limit, metadata}){
  validateVector(vector)
  const response = await chatgptIndex.query({
    vector: vector,
    topK: limit,
    includeMetadata: true,
  })
  return response.matches
}

module.exports = {
    creatememory,
    querymemory
}