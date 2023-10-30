const response = (message, data = null, success = true) => ({
  message,
  data,
  success
})

const except = (obj, ...args) => {
  if(!obj) return

  // GET A COPY OF THE OBJECT
  const objCopy = {...obj}

  // LOOP THROUGH THE ARGS
  for(let arg of args) {
    delete objCopy[arg]
  }

  return objCopy
}


const generateId = (prefix = "", length = 8) => {
  let id = prefix
  for(let i = 0; i < length; i++) {
    const rand = Math.random() * 9
    id += Math.floor(rand)
  }
  return id
}

module.exports = {
  response,
  except,
  generateId
}