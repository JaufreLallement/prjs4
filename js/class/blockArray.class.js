/**
 * Bloc contenant un tableau
 */


/**
 * Constructeur de BlockArray
 * @param {double} x          : la position en X du bloc (pourcentage)
 * @param {double} y          : la position en Y du bloc (pourcentage)
 * @param {double} w          : la largeur du bloc (pourcentage)
 * @param {double} h          : la hauteur du bloc (pourcentage)
 * @param {[array2D(text)]} c : le contenu du tableau (array 2D de Text)
 */
var BlockArray = function (x, y, w, h, c, titre) {
	Block.call (this, x, y, w, h);
	this.content = c;
	this.type = "Array";
}

// Héritage
BlockArray.prototype = new Block();

/**
 * Returne l'aspect HTML de ce bloc (dans l'éditeur)
 * @return {HTML}
 */
BlockArray.prototype.toHTML = function () {
  var res = "<div style='left: " + this.posX + "%; top: " + this.posY + "%; width: " + this.width + "%; height: " + this.height + "%;' class='bloc blockArray ui-widget-content' id='block-" + this.id + "'>";
  var tableau = arrayToTable (this.content, {
    thead: false,
    attrs: {class: 'table_class'}
  })
  res += (tableau[0].outerHTML + "</div>");
  return res;
}

/**
 * Retourne l'aspect HTML de ce bloc (pour l'export)
 * @return {HTML}
 */
BlockArray.prototype.exportHTML = function () {
  var res = "<div class='block blockArray' style='left: " + this.posX + "%; top: " + this.posY + "%; width: " + this.width + "%; height: " + this.height + "%';>";
  var tableau = arrayToTable (this.content, {
    thead: false,
    attrs: {class: 'table_class'}
  })
  res += (tableau[0].outerHTML + "</div>");
  return res;
}

/**
 * Retourne un clone de ce bloc
 * @return {Block} clone
 */
BlockArray.prototype.clone = function () {
  var o = new BlockArray();
  Block.call(o, this.posX, this.posY, this.width, this.height);
  // copie du contenu :
  o.content = new Array(this.content.length);
  for (var i = 0; i < this.content.length; i++) {
    o.content[i] = new Array(this.content[i].length)
    for (var j = 0; j < this.content[i].length; j++) {
      o.content[i][j] = this.content[i][j];
    }
  }
  o.type = this.type;
  return o;
}

