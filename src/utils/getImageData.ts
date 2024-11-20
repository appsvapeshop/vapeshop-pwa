export const getImageData = async (url: string) => {
  const response = await fetch(url)
  const blob = await response.blob()
  return await new Promise((callback) => {
    let reader = new FileReader()
    reader.onload = function () {
      callback(this.result)
    }
    reader.readAsDataURL(blob)
  })
}
