/**
 * Bloc contenant du texte
 */

 /**
  * Constructeur de blockText
  * @param {double} x             : la position en X du bloc (pourcentage)
  * @param {[double} y            : la position en Y du bloc (pourcentage)
  * @param {[double]} w           : la largeur du bloc (pourcentage)
  * @param {[double]} h           : la hauteur du bloc (pourcentage)
  * @param {[Text]} t             : le contenu textuel du bloc
  * @param {[string]} alignement  : l'alignement (gauche, droite, centre, justifié) du texte dans le bloc
  */
var BlockText = function (x, y, w, h, t, alignement) {
	Block.call (this, x, y, w, h);
  this.type = "Text";
	this.text = t || null;
	this.alignement = alignement || null
}

// Héritage
BlockText.prototype = new Block();


/**
 * Returne l'aspect HTML de ce bloc (dans l'éditeur)
 * @return {HTML}
 */
BlockText.prototype.toHTML = function () {
  var st = "style='left: " + this.posX + "%; top:" + this.posY + "%; width: " + this.width + "%; height: " + this.height + "%;' ";
  res = "<div " + st + " class='bloc blockText ui-widget-content' id='block-" + this.id + "'>" + this.text + "</div>";
  return res;
}

/**
 * Retourne l'aspect HTML de ce bloc (pour l'export)
 * @return {HTML}
 */
BlockText.prototype.exportHTML = function () {
  var res = "<div class='block blockText' style='left: " + this.posX + "%; top: " + this.posY + "%; width: " + this.width + "%; height: " + this.height + "%';>";
  res += this.text;
  res += "</div>";
  return res;
}

/**
 * Retourne un clone de ce bloc
 * @return {Block} clone
 */
BlockText.prototype.clone = function () {
  var o = new BlockText();
  Block.call(o, this.posX, this.posY, this.width, this.height);
  o.text = this.text;
  o.type = this.type;
  o.alignement = this.alignement;
  return o;
}

