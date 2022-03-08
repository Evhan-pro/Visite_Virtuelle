//Classe ImageVirtuelle3D. Permet de créer une image en 3D dont on peut parcourir en 360° (sphère avec texture de l'image à afficher).

class ImageVirtuelle3D {
  constructor(image_fichier) {
    this.image_fichier = image_fichier;
    this.x =  width/2;
    this.y = height/2;
    this.z = (height/2.0) / tan(PI*30.0 / 180.0);
    this.rayon = sqrt(sq(width) + sq(height)) / 2;
    this.rotation_x = 0.0;
    this.rotation_y = 0.0;
    this.rotation_x_bouger = 0.0;
    this.rotation_y_bouger = 0.0;
    this.decalage_x = 0.0;
    this.decalage_y = 0.0;
  }
    
  get_x() {
    return this.x;
  }

  set_x(p) {
    this.x = p;
  }

  dessiner() {
    push();
    translate(this.x, this.y, this.z); 
    rotateX(this.rotation_x);
    rotateY(this.rotation_y);
    noStroke();
    scale(-1,1);
    texture(this.image_fichier);
    sphere(this.rayon, 70, 70) 
    pop();
  }

  ajuster_decalages() {
    this.decalage_x = map(mouseX, 0, width, 90, -90) - this.rotation_y;
    this.decalage_y = map(mouseY, 0, height, -45, 45) - this.rotation_x;
  }

  deplacer() {
    this.rotation_x_bouger = constrain(map(mouseY, 0, height, -45, 45) - this.decalage_y, -90, 90);
    this.rotation_y_bouger = map(mouseX, 0, width, 90, -90)  - this.decalage_x;
    this.rotation_x = lerp(this.rotation_x, this.rotation_x_bouger, map(abs(this.rotation_x) + abs(this.rotation_x_bouger), 0, abs(this.rotation_x) + 45, 0.05, 0.25));
    this.rotation_y = lerp(this.rotation_y, this.rotation_y_bouger, map(abs(this.rotation_y) + abs(this.rotation_y_bouger), 0, abs(this.rotation_y) + 90, 0.05, 0.25));
  }
}