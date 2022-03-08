/* Projet de fin d'année pour la spécialité NSI niveau terminale. Visite Virtuelle du Lycée Renoir à partir d'images 360°. Fait par Adil Berrada et Evhan Linget.
Ce programme est une visite virtuelle créée de A à Z avec l'aide de la bibliothèque "p5.js". Il y a deux modes: un mode 2D (boucle de l'image à afficher) et un mode 3D 
(sphère avec texture de l'image à afficher). Le mode 3D a un rendu plus convaincant mais demande plus d'efforts de la part de l'ordinateur. */

let mode = '3D'; //'2D' pour le mode de rendu P2D (2 dimensions) et '3D' pour le mode de rendu WEBGL (3 dimensions).
let mode_temporaire = mode;
let changement_mode = false;
let reinitialisation = true;
let derniere_largeur_ecran = null;
let derniere_hauteur_ecran = null;
//Les noms des images sont placés dans cette variable.
let images_fichiers = {'Amphithéâtre': null, 'Self': null, 'CDI': null, 'Classe Habituelle 1': null, 'Classe Habituelle 2': null, 'Cour Principale': null, 'Cour Secondaire': null, 'Hall': null,
'Maison des Lycéens': null, 'Réfectoire': null, "Salle d'Arts": null, 'Salle de Devoir': null, 'Salle Informatique': null, 'Salle Scientifique': null, 'Accueil': null, 'Plateau Sportif': null, 'Vie Scolaire': null};
let images_suivantes = {}; //Les prochaines destinations pour chaque image sont placées dans cette variable.
for (let clef of Object.keys(images_fichiers)) {
  images_suivantes[clef] = [];
}
images_suivantes['Amphithéâtre'] = ['Vie Scolaire'];
images_suivantes['Self'] = ['Réfectoire'];
images_suivantes['CDI'] = ['Hall', 'Salle Informatique', 'Classe Habituelle 1'];
images_suivantes['Classe Habituelle 1'] = ['Classe Habituelle 2', 'Salle Scientifique', 'Hall'];
images_suivantes['Classe Habituelle 2'] = ['Classe Habituelle 1', 'Salle Scientifique', 'Hall'];
images_suivantes['Cour Principale'] = ['Cour Secondaire', 'Hall', 'Maison des Lycéens'];
images_suivantes['Cour Secondaire'] = ['Cour Principale', 'Accueil'];
images_suivantes['Hall'] = ['Vie Scolaire', 'Cour Principale', 'CDI', 'Réfectoire'];
images_suivantes['Maison des Lycéens'] = ['Cour Principale', 'Vie Scolaire', 'Plateau Sportif'];
images_suivantes['Réfectoire'] = ['Self', 'Hall'];
images_suivantes["Salle d'Arts"] = ['Salle Informatique', 'Classe Habituelle 1', 'Salle Scientifique'];
images_suivantes['Salle de Devoir'] = ['Vie Scolaire'];
images_suivantes['Salle Informatique'] = ["Salle d'Arts", 'Classe Habituelle 1', 'Salle Scientifique', 'CDI'];
images_suivantes['Salle Scientifique'] = ['Salle Informatique', "Salle d'Arts", 'Classe Habituelle 1'];
images_suivantes['Accueil'] = ['Cour Principale']
images_suivantes['Plateau Sportif'] = ['Vie Scolaire', 'Maison des Lycéens'];
images_suivantes['Vie Scolaire'] = ['Hall', 'Amphithéâtre', 'Salle de Devoir', 'Plateau Sportif']; 
let images_virtuelles = {'Boucle_Gauche': null, 'Gauche': null, 'Millieu': null, 'Droite': null, 'Boucle_Droite': null}; //Variable Utilisée pour l'effet de boucle des images (mode 2D).
let image_virtuelle_3D;
let image_principale = 'Accueil'; //Image à afficher. On commence par cette image au début du programme.
let image_zoom_2D = 1.0; //Degré de zoom sur l'image principale. Un zoom de 1 affiche l'intégralité de l'image sur l'espace disponible sur la page.
let image_zoom_2D_minimum = 1.0;
let image_zoom_2D_maximum = 5.0;
let image_zoom_2D_ajout = 0.5;
let deplacement = false; //Variable qui est true quand les images sont en déplacement et false quand elles ne le sont pas.
let largeur_originale = 1920; //Largeur par défaut de la page pour un écran d'une taille de 1920 x 1080 pixels. Tous les calculs pour la largeur des textes sont basés sur cette valeur.
let hauteur_originale = 935; //Hauteur par défaut de la page pour un écran d'une taille de 1920 x 1080 pixels. Tous les calculs pour la hauteur des textes sont basés sur cette valeur.   
let textes; //Stocke les chaînes de caractères, les tailles et les couleurs des textes dessinés pour les images.
let police; //La police utilisée pour tous les textes.
let camera_principale;
let camera_variables;
let camera_zoom = 90; //Champ de vision de la caméra.
let camera_zoom_minimum = 15;
let camera_zoom_maximum = 140;
let camera_zoom_ajout = 25;
let explication = true;
let menu; //Interface d'aide.

function preload() {
  //Chargement des images à l'exécution du programme.
  for (let clef of Object.keys(images_fichiers)) {
    images_fichiers[clef] = loadImage("https://lyc-ajrenoir.paysdelaloire.e-lyco.fr/wp-content/uploads/sites/15/2021/06/"+clef.replaceAll(' ', '-').replaceAll('é', 'e').replaceAll('â', 'a').replaceAll("'", '')+"-scaled.jpeg"); //Toutes les images sont au format .jpeg.
  }
  police = loadFont('Polices/Montserrat-Black.otf');
}

function setup() {
  //Initialisation du programme (fenêtre, variables globales, etc.).
  if (mode == '2D') {
    createCanvas(windowWidth, windowHeight, P2D);
  }
  else if (mode == '3D') {
    createCanvas(windowWidth, windowHeight, WEBGL);
    angleMode(DEGREES);
    setAttributes('alpha', false);
    camera_principale = createCamera();
    setCamera(camera_principale);
    ajuster_camera();
    orbitControl();
  }
  frameRate(60);
  smooth(2);
  imageMode(CORNER);  
  textFont(police);
  textAlign(CENTER, BOTTOM);
  if (changement_mode && derniere_largeur_ecran != width || changement_mode && derniere_hauteur_ecran != height) {
    resizeCanvas(derniere_largeur_ecran, derniere_hauteur_ecran);
  }
  reinitialisation = false;
  changement_mode = false;
  
  reinitialisation_globale();
}

function draw() {    
  //Boucle principale du programme.
  background(255, 255, 255);
  if (mode == '3D') {
    image_virtuelle_3D.dessiner();
  }
  else if (mode == '2D') {
    for (let clef of Object.keys(images_virtuelles)) {
      for (let i = 0; i < images_virtuelles[clef].length; i++) {
        image(...images_virtuelles[clef][i].variables_image());
      }
    }
  }
  if (menu) {
    background(0, 0, 0);
    menu.dessiner();
  }
  for (let clef of Object.keys(textes)) {   
    fill(textes[clef]['Couleur']);
    textSize(textes[clef]['Taille']);
    text(...textes[clef]['Valeurs']);
  } 
}

function mousePressed() {
  //Fonction qui s'exécute quand un des boutons de la souris a été appuyé.
  if (mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0 && reinitialisation == false && changement_mode == false) {
    if (mouseButton == LEFT) {
      deplacement = true;
      if (mode == '2D') {
        for (let clef of Object.keys(images_virtuelles)) {
          for (let i = 0; i < images_virtuelles[clef].length; i++) {
            images_virtuelles[clef][i].ajuster_decalages();
          }
        }
      }
      else if (mode == '3D') {
        image_virtuelle_3D.ajuster_decalages();
      }
      if (menu) {
        menu.boutons_appuyer(mouseX, mouseY);
      }
    }
    else if (mouseButton == RIGHT && menu) {
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
  }
}

function touchMoved() {
  //Fonction qui s'exécute quand un des boutons de la souris a été appuyé.
  if (mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0 && reinitialisation == false && changement_mode == false) {
    if (mouseButton == LEFT) {
      deplacement = true;
      if (mode == '2D') {
        for (let clef of Object.keys(images_virtuelles)) {
          for (let i = 0; i < images_virtuelles[clef].length; i++) {
            images_virtuelles[clef][i].ajuster_decalages();
          }
        }
      }
      else if (mode == '3D') {
        image_virtuelle_3D.ajuster_decalages();
      }
      if (menu) {
        menu.boutons_appuyer(mouseX, mouseY);
      }
    }
    else if (mouseButton == RIGHT && menu) {
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
  }
}

function mouseDragged() {
  //Fonction qui s'exécute à chaque fois que la souris a été déplacée.
  if (deplacement && reinitialisation == false && changement_mode == false && mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0) {
    if (mode == '2D') {
      for (let clef of Object.keys(images_virtuelles)) {
        for (let i = 0; i < images_virtuelles[clef].length; i++) {
          images_virtuelles[clef][i].deplacer();
        }
      }
    }
    else if (mode == '3D') {
      image_virtuelle_3D.deplacer();
    }  
  }
  return false;
}

function mouseReleased() {
  //Fonction qui s'exécute quand un des boutons de la souris a été relâché.
  if (mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0 && reinitialisation == false && changement_mode == false) {
    deplacement = false;
    if (mode == '2D') {
      verifier_boucle();
    }
  }
}

function mouseWheel(event) {
  //Fonction qui s'exéctue quand on scrolle la souris.
  image_zoom_2D += map(event.delta, -100, 100, image_zoom_2D_ajout, -image_zoom_2D_ajout, true);
  camera_zoom += map(event.delta, -100, 100, -camera_zoom_ajout/5, camera_zoom_ajout/5, true);
  if (mode == '2D') {
    reinitialisation_globale();
  }
  else if (mode == '3D') {
    ajuster_camera();
  }
  return false;
}

function verifier_boucle() {
  //Fonction qui permet de vérifier s'il est nécessaire de boucler l'image.
  if (images_virtuelles['Gauche'][0].get_x() >= 0) {
    images_virtuelles = effectuer_boucle(images_virtuelles, 'Gauche')
    boutons = effectuer_boucle(boutons, 'Gauche')
  }
  else if (images_virtuelles['Droite'][0].get_x() <= 0) {
    images_virtuelles = effectuer_boucle(images_virtuelles, 'Droite')
    boutons = effectuer_boucle(boutons, 'Droite')
  }
}

function effectuer_boucle(elements, direction) {
  //Fonction qui effectue une boucle pour les images ou les boutons dans le mode 2D.
  if (direction == 'Gauche') {
    let temp_element_droite = elements['Droite'];
    let temp_element_boucle_droite = elements['Boucle_Droite'];
    elements['Boucle_Droite'] = elements['Millieu'];
    elements['Droite'] = elements['Gauche'];
    elements['Millieu'] = elements['Boucle_Gauche'];
    elements['Gauche'] = temp_element_droite;
    elements['Boucle_Gauche'] = temp_element_boucle_droite;
    for (let i = 0; i < elements['Gauche'].length; i++) {
      elements['Gauche'][i].set_x((elements['Millieu'][i].get_x() - width * image_zoom_2D));
    }
    for (let i = 0; i < elements['Boucle_Gauche'].length; i++) {
      elements['Boucle_Gauche'][i].set_x((elements['Millieu'][i].get_x() - width * 2 * image_zoom_2D));
    }
  }
  else if (direction == 'Droite') {
    let temp_element_gauche = elements['Gauche'];
    let temp_element_boucle_gauche = elements['Boucle_Gauche'];
    elements['Boucle_Gauche'] = elements['Millieu'];
    elements['Gauche'] = elements['Droite'];
    elements['Millieu'] = elements['Boucle_Droite'];
    elements['Droite'] = temp_element_gauche;
    elements['Boucle_Droite'] = temp_element_boucle_gauche;
    for (let i = 0; i < elements['Droite'].length; i++) {
      elements['Droite'][i].set_x((elements['Millieu'][i].get_x() + width * image_zoom_2D));
    }
    for (let i = 0; i < elements['Boucle_Droite'].length; i++) {
      elements['Boucle_Droite'][i].set_x((elements['Millieu'][i].get_x() + width * 2 * image_zoom_2D));
    }
  }
  else {
    throw new ReferenceError("Il faut choisir une direction (gauche ou droite) pour effectuer une boucle");
  }
  return elements;
}

function reinitialisation_globale() {
  //Fonction qui réinitialise la totalité des images, des boutons et des textes.
  if (changement_mode == false && reinitialisation == false) {
    reinitialisation = true;
    image_zoom_2D = constrain(image_zoom_2D, image_zoom_2D_minimum, image_zoom_2D_maximum);
    camera_zoom = constrain(camera_zoom, camera_zoom_minimum, camera_zoom_maximum);
    if (mode == '3D') {
      ajuster_camera();
    }
    reinitialiser_images();
    if (menu) {
      menu.reinitialser_boutons();
      menu.reinitialser_textes();
    }
    reinitialiser_textes();
    reinitialisation = false;
  }
}  

function reinitialiser_images() {
  //Fonction qui réinitialise les images en les supprimant puis en les recréant.
  if (mode == '2D') {
    if (images_virtuelles['Millieu'] == null) {
      images_virtuelles['Boucle_Gauche'] = [new ImageVirtuelle(images_fichiers[image_principale], -width * 2, 0.0, width, height)];
      images_virtuelles['Gauche'] = [new ImageVirtuelle(images_fichiers[image_principale], -width, 0.0, width, height)];
      images_virtuelles['Millieu'] = [new ImageVirtuelle(images_fichiers[image_principale], 0.0, 0.0, width, height)];
      images_virtuelles['Droite'] = [new ImageVirtuelle(images_fichiers[image_principale], width, 0.0, width, height)];
      images_virtuelles['Boucle_Droite'] = [new ImageVirtuelle(images_fichiers[image_principale], width * 2, 0.0, width, height)];
    }
    else {
      images_virtuelles['Boucle_Gauche'] = [new ImageVirtuelle(images_fichiers[image_principale], -width * 2, 0.0, width, height)];
      images_virtuelles['Gauche'] = [new ImageVirtuelle(images_fichiers[image_principale], -width, 0.0, width, height)];
      images_virtuelles['Millieu'] = [new ImageVirtuelle(images_fichiers[image_principale], 0.0, 0.0, width, height)];
      images_virtuelles['Droite'] = [new ImageVirtuelle(images_fichiers[image_principale], width, 0.0, width, height)];
      images_virtuelles['Boucle_Droite'] = [new ImageVirtuelle(images_fichiers[image_principale], width * 2, 0.0, width, height)];
    }
    for (let clef of Object.keys(images_virtuelles)) {
      for (let i = 0; i < images_virtuelles[clef].length; i++) {
        images_virtuelles[clef][i].ajuster_decalages();
      }
    }
  }
  else if (mode == '3D') {
    image_virtuelle_3D = new ImageVirtuelle3D(images_fichiers[image_principale]);
  }
}

function reinitialiser_textes() {
  //Fonction qui réinitialise les chaînes de caractères affichées.
  let taille = 32;
  let largeur = map(largeur_originale + hauteur_originale - largeur_originale, 1, largeur_originale + hauteur_originale, 1, taille)
  let hauteur = map(largeur_originale + hauteur_originale - hauteur_originale, 1, largeur_originale + hauteur_originale, 1, taille)
  textes = {}
  if (explication) {
    textes['Explication'] = {'Valeurs': ["Appuyez sur I pour afficher l'interface d'aide.", width/3, height / (hauteur_originale/(hauteur*2)),], 'Taille': width / (largeur_originale/largeur) + height / (hauteur_originale/hauteur), 'Couleur': 'rgba(0, 0, 0, 1)'};
  }
}

function ajuster_camera() {
  //Fonction qui ajuste la position de la caméra.
  camera_variables = [width/2, height/2, (height/2.0) / tan(PI*30.0 / 180.0), width/2, height/2, 0, 0, 1, 0];
  camera_principale.camera(...camera_variables)
  camera_zoom = constrain(camera_zoom, camera_zoom_minimum, camera_zoom_maximum);
  perspective(camera_zoom);
}

function keyPressed() {
  //Fonction qui s'exécute quand une touche spécifique du clavier a été appuyée.
  if (!mouseIsPressed && reinitialisation == false && changement_mode == false) {
    if (keyCode == ENTER) { //Change l'image en une image aléatoirement choisie.
      let fichier_clefs = Object.keys(images_fichiers);
      fichier_clefs.splice(fichier_clefs.indexOf(image_principale), 1);
      image_principale = fichier_clefs[floor(random(0, fichier_clefs.length))];
      reinitialisation_globale();
    }
    if (key == '+') {
      image_zoom_2D += image_zoom_2D_ajout;
      camera_zoom -= camera_zoom_ajout;
      if (mode == '2D') {
        reinitialisation_globale();
      }
      else if (mode == '3D') {       
        ajuster_camera();
      }
    }
    if (key == '-') {
      image_zoom_2D -= image_zoom_2D_ajout;
      camera_zoom += camera_zoom_ajout;
      if (mode == '2D') {       
        reinitialisation_globale();
      }  
      else if (mode == '3D') {        
        ajuster_camera();
      }
    }
    if (key == 'e' || key == 'E') {
      if (menu) {
        menu = null;
        if (mode != mode_temporaire) {
          changement_mode = true;
          mode = mode_temporaire;
          derniere_largeur_ecran = width;
          derniere_hauteur_ecran = height;
          remove();
          new p5();
        }
        reinitialisation_globale();
      }
      else {
        menu = new Interface()
        explication = false;
        reinitialiser_textes();
        if (mode == '3D') {
          mode = '2D';
          remove();
          new p5();
        }
      }
    }
    if (key == 'm' || key == 'M') {
      derniere_largeur_ecran = width;
      derniere_hauteur_ecran = height;
      if (menu) {
        if (mode_temporaire == '2D') {
          mode_temporaire = '3D';
        }
        else if (mode_temporaire == '3D') {
          mode_temporaire = '2D'
        }
        reinitialisation_globale();
      }
      else {
        changement_mode = true;
        if (mode == '2D') {
          mode = '3D';
        }
        else if (mode == '3D') {
          mode = '2D';
        }
        remove();
        new p5();     
      }
    }
    if (keyIsDown(73) && keyIsDown(76) && key == 'y') {
      console.log('S.G.');
    }
    if (keyIsDown(80) && key == 'a') {
      console.log('A.D.');
    }
  }
  return false;
}

function windowResized() {
  //Fonction qui s'exécute quand la taille de la fenêtre a changé.*
  resizeCanvas(windowWidth, windowHeight);
  reinitialisation_globale();
}

function est_appareil_mobile() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}
