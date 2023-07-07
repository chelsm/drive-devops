export class FileFunction {
  /**
   * Generate file url
   * @param picturePath
   * @constructor
   */
  public static GenerateFile(picturePath: string) {
    // si on utilise un serveur generé le fichier via le serveur.
    return `${__dirname}/${picturePath}`;
  }
}
