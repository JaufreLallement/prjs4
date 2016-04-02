/**
 * Classe Block : représente un bloc de contenu dans une diapositive
 */

/**
 * Constructeur de Block
 * @param {double} x  : la position en X du bloc (pourcentage)
 * @param {double} y  : la position en Y du bloc (pourcentage)
 * @param {double} w  : la largeur du bloc (pourcentage)
 * @param {double} h  : la hauteur du bloc (pourcentage)
 */
var Block = function (x, y, w, h) {
	this.id = Block.lastId;
  Block.lastId++;
	this.posX = x || 0;
	this.posY = y || 0;
	this.width = w;
	this.height = h;
}

// Attribut de classe représentant l'ID le plus petit disponible
Block.lastId = 0;


/**
 * Déplacer ce bloc dans la diapositive
 * @param  {double} x : le nouvel emplacement du bloc en X dans la diapo (pourcentage)
 * @param  {double} y : le nouvel emplacement du bloc en Y dans la diapo (pourcentage)
 * @return {[void]}
 */
Block.prototype.move = function(x, y) {
  this.posX = x || this.posX;
	this.posY = y || this.posY;
}

/**
 * Redimensionner ce bloc
 * @param  {double} w : la nouvelle largeur du bloc (pourcentage)
 * @param  {double} h : la nouvelle hauteur du bloc (pourcentage)
 * @return {void}
 */
Block.prototype.resize = function(w, h) {
		this.width = w || this.width;
		this.height = h || this.height;
}
