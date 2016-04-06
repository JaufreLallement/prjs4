/**
 * Classe représentant une slide
 */

/**
 * Constructeur de slide
 * @param  {string} titre    : le titre de la slide
 * @param  {int} position    : la position de la slide
 */
var Slide = function (titre, position) {
  this.id = Slide.lastId;
  Slide.lastId++;
  this.titre = titre;
  this.background = 'img/default_bg.png';
  this.position = position;
  this.blocks = [];
}

// Attribut de classe représentant l'ID le plus petit disponible
Slide.lastId = 0;

/**
 * Ajoute un bloc de contenu à cette slide
 * @param {[Block]} block : le bloc à ajouter
 */
Slide.prototype.addBlock = function(block) {
  this.blocks.push(block);
}

/**
 * Supprime un bloc de cette slide
 * @param  {Block} block : le bloc à supprimer
 */
Slide.prototype.removeBlock = function (block) {
  var index = this.blocks.indexOf(block);
  if (index != -1) {
    this.blocks.splice(index, 1);
  }
}

/**
 * Retourne l'aspect HTML de cette slide (dans l'éditeur)
 * @return {HTML}
 */
Slide.prototype.toHTML = function () {
  res = "";
  for (var i = 0; i < this.blocks.length; i++) {
    res += this.blocks[i].toHTML();
  }
  return res;
}

/**
 * Retourne un clone de cette Slide
 * @return {Slide} clone
 */
Slide.prototype.clone = function () {
  var o = new Slide("Copie", 0);
  o.titre = "Copie de " + this.titre;
  for (var i = 0; i < this.blocks.length; i++) {
    o.addBlock(this.blocks[i].clone());
  }
  o.background = this.background;
  return o;
}
