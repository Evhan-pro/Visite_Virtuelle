//Classe Bouton. Permet de créer des boutons pour interagir avec la visite virtuelle. Ces boutons sont utilisés pour l'interface d'aide.

class Bouton {
  constructor(x, y, largeur, hauteur, couleur, action, parametres = null) {
    this.x = x;
    this.y = y;
    this.largeur = largeur;
    this.hauteur = hauteur;
    this.couleur = couleur;
    this.action = action;
    this.parametres = parametres;
  }

  get_x() {
    return this.x;
  }

  set_x(p) {
    this.x = p;
  }

  appuyer(sourieX, sourieY) {
    if (sourieX >= this.x && sourieX <= this.x + this.largeur && sourieY >= this.y && sourieY <= this.y + this.hauteur) {
      if (this.action == 'Deplacer') {
        if (this.parametres) {
          image_principale = this.parametres;
        }
        else {
          let fichier_clefs = Object.keys(images_fichiers);
          fichier_clefs.splice(fichier_clefs.indexOf(image_principale), 1);
          image_principale = fichier_clefs[floor(random(0, fichier_clefs.length))];
        }    
        reinitialisation_globale();
      }
      else if (this.action == 'Afficher') {
        menu = null;
        if (mode != mode_temporaire) {
          changement_mode = true;
          explication = true;
          mode = mode_temporaire;
          derniere_largeur_ecran = width;
          derniere_hauteur_ecran = height;
          remove();
          new p5();
        }
        reinitialisation_globale();
      }
      else if (this.action == 'Deplacer_Afficher') {
        if (this.parametres) {
          image_principale = this.parametres;
        }
        else {
          let fichier_clefs = Object.keys(images_fichiers);
          fichier_clefs.splice(fichier_clefs.indexOf(image_principale), 1);
          image_principale = fichier_clefs[floor(random(0, fichier_clefs.length))];
        }    
        menu = null;
        if (mode != mode_temporaire) {
          changement_mode = true;
          explication = true;
          mode = mode_temporaire;
          derniere_largeur_ecran = width;
          derniere_hauteur_ecran = height;
          remove();
          new p5();
        }
        reinitialisation_globale();
      }
      else if (this.action == 'Changer_Mode') {
        derniere_largeur_ecran = width;
        derniere_hauteur_ecran = height;
        if (mode_temporaire == '2D') {
          mode_temporaire = '3D';
        }
        else if (mode_temporaire == '3D') {
          mode_temporaire = '2D'
        }
        reinitialisation_globale();
      }
      else if (this.action == 'Zoomer') {
        if (mode_temporaire == '2D') {
          image_zoom_2D += 0.5;
        }
        else if (mode_temporaire == '3D') {
          camera_zoom -= 25;
        }
        reinitialisation_globale();
      }
      else if (this.action == 'Dezoomer') {
        if (mode_temporaire == '2D') {
          image_zoom_2D -= 0.5;
        }  
        else if (mode_temporaire == '3D') {
          camera_zoom += 25;
        }
        reinitialisation_globale();
      }
      else if (this.action == 'Image_Suivante') {
        menu.changer_selection(-1);
        reinitialisation_globale();
      }
      else if (this.action == 'Image_Precedente') {
        menu.changer_selection(1);
        reinitialisation_globale();
      }
      else {
        print('Le bouton aux coordonnées x:',round(this.x),'y:',round(this.y),'a été appuyé. Aucune action a été attribuée à ce bouton.');
      }
    }
  }

  dessiner() {
    noStroke();
    fill(this.couleur);
    rect(this.x, this.y, this.largeur, this.hauteur);
  }
}