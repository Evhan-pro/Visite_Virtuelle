//Classe Interface. Permet de créer une interface graphique pour aider l'utilisateur à se déplacer d'image à image.

class Interface {
  constructor() {
    this.positions_boutons = {};
    this.boutons = [];
    this.textes = {};
    this.images = Object.keys(images_fichiers).sort();
    this.image_selectionnee = this.images.indexOf(image_principale);
    this.texte_taille = 32;
    this.largeur_texte = map(largeur_originale + hauteur_originale - largeur_originale, 1, largeur_originale + hauteur_originale, 1, this.texte_taille);
    this.hauteur_texte = map(largeur_originale + hauteur_originale - hauteur_originale, 1, largeur_originale + hauteur_originale, 1, this.texte_taille);
    this.reinitialser_boutons();
    this.reinitialser_textes();
  }

  boutons_appuyer(sourieX, sourieY) {
    for (let i = 0; i < this.boutons.length; i++) {
      this.boutons[i].appuyer(sourieX, sourieY);
    }
  }

  reinitialser_boutons() {
    this.boutons = [];
    this.positions_boutons = {};
    this.positions_boutons['Changer_Mode'] = {'X': width*3/6 - (width/8)/2, 'Y': height / (hauteur_originale/(this.hauteur_texte*2)), 'Largeur': width/8, 'Hauteur': height/8, 'Couleur': 'rgba(0, 0, 0, 0.75)', 'Action': 'Changer_Mode'};
    this.positions_boutons['Image_Aleatoire'] = {'X': width - width/20 - width/5, 'Y': height/4, 'Largeur': width/6, 'Hauteur': height/8, 'Couleur': 'rgba(0, 0, 0, 0.75)', 'Action': 'Deplacer'};
    this.positions_boutons['Image_Aleatoire_Afficher'] = {'X': width*5/6 - (width/6)/2, 'Y': height / (hauteur_originale/(this.hauteur_texte*2)), 'Largeur': width/6, 'Hauteur': height/6, 'Couleur': 'rgba(0, 0, 0, 0)', 'Action': 'Afficher'};
    this.positions_boutons['Zoomer'] = {'X': width*1/6 + (width/50)/2, 'Y': height / (hauteur_originale/(this.hauteur_texte*2)), 'Largeur': width/50, 'Hauteur': height/25, 'Couleur': 'rgba(0, 0, 0, 0.75)', 'Action': 'Zoomer'};
    this.positions_boutons['Dezoomer'] = {'X': width*1/6 - (width/50), 'Y': height / (hauteur_originale/(this.hauteur_texte*2)), 'Largeur': width/50, 'Hauteur': height/25, 'Couleur': 'rgba(0, 0, 0, 0.75)', 'Action': 'Dezoomer'};
    this.positions_boutons['Image_Suivante'] = {'X': width*5/6 - (width/15)/2, 'Y': height*2.5/4 - height/15, 'Largeur': width/15, 'Hauteur': height/15, 'Couleur': 'rgba(0, 0, 0, 0.75)', 'Action': 'Image_Suivante'};
    this.positions_boutons['Image_Precedente'] = {'X': width*5/6 - (width/15)/2, 'Y': height*2.5/4 + height/6, 'Largeur': width/15, 'Hauteur': height/15, 'Couleur': 'rgba(0, 0, 0, 0.75)', 'Action': 'Image_Precedente'};
    this.positions_boutons['Image_Selection'] = {'X': width*5/6 - (width/6)/2, 'Y': height*2.5/4, 'Largeur': width/6, 'Hauteur': height/6, 'Couleur': 'rgba(0, 0, 0, 0)', 'Action': 'Deplacer_Afficher', 'Parametres': this.images[this.image_selectionnee]};
    let n_suivantes = images_suivantes[image_principale].length;
    for (let i = 0; i < n_suivantes; i++) {
      this.positions_boutons['Image_'+str(i)] = {'X': width*((7/n_suivantes)/20) + (width*((7/n_suivantes)/20)) * i * 2 - (width/10)/2, 'Y': height/3, 'Largeur': width/10, 'Hauteur': height/10, 'Couleur': 'rgba(0, 0, 0, 0)', 'Action': 'Deplacer_Afficher', 'Parametres': images_suivantes[image_principale][i]};
    }
    for (let clef of Object.keys(this.positions_boutons)) {
      let position_x = this.positions_boutons[clef]['X'];
      let position_y = this.positions_boutons[clef]['Y'];
      let largeur = this.positions_boutons[clef]['Largeur'];
      let hauteur = this.positions_boutons[clef]['Hauteur'];
      let couleur = this.positions_boutons[clef]['Couleur'];
      let action = this.positions_boutons[clef]['Action'];
      let parametres = this.positions_boutons[clef]['Parametres'];
      this.boutons.push(new Bouton(position_x, position_y, largeur, hauteur, couleur, action, parametres));
    }
  }

  reinitialser_textes() {
    this.textes = {}
    if (mode_temporaire == '2D') {
      this.textes['Zoom'] = {'Valeurs': ['Zoom: '+floor(image_zoom_2D)+','+str((image_zoom_2D-floor(image_zoom_2D))*10)+'X', width*1/6, height / (hauteur_originale/(this.hauteur_texte*2))], 'Taille': width / (largeur_originale/this.largeur_texte) + height / (hauteur_originale/this.hauteur_texte), 'Couleur': 'rgba(255, 255, 255, 1)'};
    }
    else if (mode_temporaire == '3D') {
      let camera_zoom_affichage = round(map(camera_zoom, camera_zoom_minimum, camera_zoom_maximum, 6, 1), 1)
      this.textes['Zoom'] = {'Valeurs': ['Zoom: '+floor(camera_zoom_affichage)+','+str(round((camera_zoom_affichage-floor(camera_zoom_affichage))*10, 1))+'X', width*1/6, height / (hauteur_originale/(this.hauteur_texte*2))], 'Taille': width / (largeur_originale/this.largeur_texte) + height / (hauteur_originale/this.hauteur_texte), 'Couleur': 'rgba(255, 255, 255, 1)'};
    }
    this.textes['Zoomer'] = {'Valeurs': ['+', width*1/6 + (width/50), height / (hauteur_originale/(this.hauteur_texte*3.95))], 'Taille': width / (largeur_originale/this.largeur_texte) + height / (hauteur_originale/(this.hauteur_texte+6)), 'Couleur': 'rgba(255, 255, 255, 1)'};
    this.textes['Dezoomer'] = {'Valeurs': ['-', width*1/6 - (width/50)/2, height / (hauteur_originale/(this.hauteur_texte*3.90))], 'Taille': width / (largeur_originale/this.largeur_texte) + height / (hauteur_originale/(this.hauteur_texte+6)), 'Couleur': 'rgba(255, 255, 255, 1)'};
    this.textes['Mode'] = {'Valeurs': ['Mode: '+mode_temporaire, width*3/6, height / (hauteur_originale/(this.hauteur_texte*2))], 'Taille': width / (largeur_originale/this.largeur_texte) + height / (hauteur_originale/this.hauteur_texte), 'Couleur': 'rgba(255, 255, 255, 1)'};
    this.textes['Image'] = {'Valeurs': ['Lieu Affiché : '+image_principale, width*5/6, height / (hauteur_originale/(this.hauteur_texte*2))], 'Taille': width / (largeur_originale/(this.largeur_texte-6)) + height / (hauteur_originale/this.hauteur_texte), 'Couleur': 'rgba(255, 255, 255, 1)'};
    this.textes['Changer_Mode'] = {'Valeurs': ["Changer le Mode d'Affichage (2D/3D)", width*3/6 - (width/8)/2, height / (hauteur_originale/(this.hauteur_texte*2)) - (height/8)/2 + height / (hauteur_originale/(this.hauteur_texte)), width/8, height/8], 'Taille': width / (largeur_originale/(this.largeur_texte-6)) + height / (hauteur_originale/(this.hauteur_texte-6)), 'Couleur': 'rgba(255, 255, 255, 1)'};
    this.textes['Image_Aleatoire'] = {'Valeurs': ["Choisir un Lieu Aléatoirement", width - width/20 - width/5, height/4 - (height/8)/2 + height / (hauteur_originale/(this.hauteur_texte)), width/6, height/8], 'Taille': width / (largeur_originale/(this.largeur_texte-6)) + height / (hauteur_originale/(this.hauteur_texte-6)), 'Couleur': 'rgba(255, 255, 255, 1)'};
    this.textes['Image_Choisir'] = {'Valeurs': ["Prochain(s) Lieu(x) : ", width*(7/20), height/3 - height / (hauteur_originale/(this.hauteur_texte*2))], 'Taille': width / (largeur_originale/(this.largeur_texte)) + height / (hauteur_originale/(this.hauteur_texte)), 'Couleur': 'rgba(255, 255, 255, 1)'};
    this.textes['Image_Precedente'] = {'Valeurs': ['Précédent', width*5/6 - (width/15)/2,  height*2.5/4 - height/15 - height / (hauteur_originale/(this.hauteur_texte)), width/15, height/15], 'Taille': width / (largeur_originale/(this.largeur_texte-8)) + height / (hauteur_originale/(this.hauteur_texte-8)), 'Couleur': 'rgba(255, 255, 255, 1)'};
    this.textes['Image_Suivante'] = {'Valeurs': ['Suivant', width*5/6 - (width/15)/2, height*2.5/4 + height/6 - height / (hauteur_originale/(this.hauteur_texte)), width/15, height/15], 'Taille': width / (largeur_originale/(this.largeur_texte-8)) + height / (hauteur_originale/(this.hauteur_texte-8)), 'Couleur': 'rgba(255, 255, 255, 1)'};
    this.textes['Image_Selection'] = {'Valeurs': ['Sélectionez un Lieu.\nLieu Sélectionné : '+[this.images[this.image_selectionnee]], width*5/6, height*2.25/4 - height / (hauteur_originale/(this.hauteur_texte))], 'Taille': width / (largeur_originale/(this.largeur_texte-6)) + height / (hauteur_originale/(this.hauteur_texte-6)), 'Couleur': 'rgba(255, 255, 255, 1)'};
    let n_suivantes = images_suivantes[image_principale].length;
    for (let i = 0; i < n_suivantes; i++) {
      this.textes['Image_'+str(i)] = {'Valeurs': [images_suivantes[image_principale][i], width*((7/n_suivantes)/20) + (width*((7/n_suivantes)/20)) * i * 2, height/3], 'Taille': width / (largeur_originale/(this.largeur_texte-6)) + height / (hauteur_originale/(this.hauteur_texte-6)), 'Couleur': 'rgba(255, 255, 255, 1)'};
    }
    this.textes['Aide'] = {'Valeurs': ["Guide des Contrôles :\nAppuyez sur I/le bouton droit de la souris pour afficher/cacher l'interface d'aide.\nAppuyez sur M pour changer le mode d'affichage (2D/3D).\nAppuyez sur + ou scroller pour zoomer sur l'image.\nAppuyez sur - ou scroller pour dézoomer sur l'image.\nAppuyez sur Entrée pour afficher une image aléatoire.\nAppuyez sur une des images de l'interface avec le bouton gauche pour l'afficher en plein écran.", width/3, height/1.25], 'Taille': width / (largeur_originale/(this.largeur_texte-5)) + height / (hauteur_originale/(this.hauteur_texte-5)), 'Couleur': 'rgba(255, 255, 255, 1)'};
    this.textes['Auteurs'] = {'Valeurs': ["Projet de fin d'année en NSI de niveau Terminale. Visite virtuelle du Lycée Auguste et Jean Renoir.\nGroupe de Adil Berrada (TD) et Evhan Linget (TA) de l'année scolaire 2020-2021.", width/2, height], 'Taille': width / (largeur_originale/(this.largeur_texte-5)) + height / (hauteur_originale/(this.hauteur_texte-5)), 'Couleur': 'rgba(0, 0, 0, 1)'};
  }

  changer_selection(n) {
    this.image_selectionnee += n;
    if (this.image_selectionnee >= this.images.length) {
      this.image_selectionnee = 0;
    }
    else if (this.image_selectionnee < 0) {
      this.image_selectionnee = this.images.length - 1;
    }
  }

  dessiner() {
    noStroke();
    fill('rgba(180, 150, 206, 0.9)');
    rect(0, 0, width, height);
    image(images_fichiers[image_principale], width*5/6 - (width/6)/2, height / (hauteur_originale/(this.hauteur_texte*2)), width/6, height/6);
    image(images_fichiers[this.images[this.image_selectionnee]], width*5/6 - (width/6)/2, height*2.5/4, width/6, height/6);
    let n_suivantes = images_suivantes[image_principale].length;
    for (let i = 0; i < n_suivantes; i++) {
      image(images_fichiers[images_suivantes[image_principale][i]], width*((7/n_suivantes)/20) + (width*((7/n_suivantes)/20)) * i * 2 - (width/10)/2, height/3, width/10, height/10);
    }
    for (let i = 0; i < this.boutons.length; i++) { 
      this.boutons[i].dessiner();
    }
    for (let clef of Object.keys(this.textes)) {   
      fill(this.textes[clef]['Couleur']);
      textSize(this.textes[clef]['Taille']);
      text(...this.textes[clef]['Valeurs']);
    }
  }
}