exports.handler = async function http (req) {
  return {
    statusCode: 302,
    headers: {
      'location': 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
    }
  }
}

