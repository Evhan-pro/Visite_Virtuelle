//Classe ImageVirtuelle. Permet de créer une image en 2D dont on peut parcourir avec un effet de boucle.

class ImageVirtuelle {
  constructor(image_fichier, x, y, largeur, hauteur) {
    this.image_fichier = image_fichier;
    this.x = x * image_zoom_2D;
    this.y = y * image_zoom_2D;
    this.largeur = largeur * image_zoom_2D;
    this.hauteur = hauteur * image_zoom_2D;
    this.decalage_x = 0.0;
    this.decalage_y = 0.0;
  }
    
  get_x() {
    return this.x;
  }
  
  get_y() {
    return this.y;
  }
  
  set_x(p) {
    this.x = p;
  }

  ajuster_decalages() {
    this.decalage_x = mouseX - this.x;
    this.decalage_y = mouseY - this.y;
  }

  get_adapter_x() {
    return map(this.x*2, this.x, this.x + this.largeur, 0, width * image_zoom_2D);
  }

  get_adapter_y() {
    return map(this.y*2, this.y, this.y - this.hauteur, 0, ((-this.hauteur + height) * image_zoom_2D));
  }

  variables_image() {
    return [this.image_fichier, this.x, this.y, this.largeur, this.hauteur];
  }

  deplacer() {
    this.x = mouseX - this.decalage_x;
    this.y = constrain(mouseY - this.decalage_y, -this.hauteur + height, 0);
  }
}