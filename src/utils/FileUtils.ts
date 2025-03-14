/**
 * Download file from given URL and return data that represents that file
 *
 * @return data that represents file from given URL
 */
export const getFileData = async (url: string) => {
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
