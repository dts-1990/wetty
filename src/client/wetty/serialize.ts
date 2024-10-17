 import {} from "wicg-file-system-access"

/**
 * Supply a button-id in HTML, when user clicks the file is opened for write-append.
 * 
 * Other code can: new LogWriter().writeLine("First line...") 
 * to queue writes before user clicks the button.
 * 
 * file is flushed/closed & re-opened after every writeLine.
 * (so log is already saved if browser crashes...)
 */
export class LogWriter {
  fileHandle: FileSystemFileHandle;
  /*  
  writeablePromise: Promise<FileSystemWritableFileStream> = this.newWriterPromise;
  */
  writerReady: FileSystemWritableFileStream
  contents: string
  isWriting = false
    
  constructor(public buttonId = "fsOpenFileButton", name = 'logFile') {
    const fsOpenButton = document.getElementById(this.buttonId)
    if (!fsOpenButton) return;
    fsOpenButton.onclick = () => {
      window.showSaveFilePicker({
              id: 'logWriter',
              startIn: 'downloads', // documents, desktop, music, pictures, videos
              suggestedName: name,
              types: [ 
                {
                  description: 'Text Files',
                  accept: { 'text/plain': ['.txt'], },
                },
              ],
            }).then((value: any) => {
              this.fileHandle = value as FileSystemFileHandle
              console.log("Handler: ", this.fileHandle)
              this.openWriteable()
            }
            , (rej: any) => {
        console.warn(`showOpenFilePicker failed: `, rej)
      });
    }
  }
  
  async openWriteable(options: FileSystemCreateWritableOptions = { keepExistingData: true }) {
    if (!this.fileHandle) throw (Error("No file handler"))
    
    const writeable = await this.fileHandle.createWritable(options)
    const offset = (await this.fileHandle.getFile()).size
    writeable.seek(offset)
    this.writerReady = writeable
    console.log("writerReady=", this.writerReady)
  }
  
  async writeLine(text: string) {
    try {
      console.log("sontd0")
      console.warn(text)
      console.log("sontd1")
      this.contents = `${this.contents}${text}`
      // Count lines, if 10 lines, write to output file
      const lines = (String(this.contents).match(/\n/g) || '').length + 1
      console.log("lines=", lines)
      if (lines < 2 || this.isWriting) return
            
      console.log("sontd2")
      await this.openWriteable()
      const writingContent = this.contents
      this.contents = ''

      this.isWriting = true;
      await this.writerReady.write({type: 'write', data: writingContent});
      await this.writerReady.close();
      this.isWriting = false;
    } catch (err) {
      console.warn(`.writeLine failed:`, err)
      throw err
    }
  }
/*  
  async closeFile() {
    try {
      return (await this.writeablePromise).close();
    } catch (err) {
      console.warn(`.closeFile failed:`, err)
      throw err
    }
  }
*/
}