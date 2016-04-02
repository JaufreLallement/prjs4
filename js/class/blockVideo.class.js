/**
 * Bloc contenant une vidéo
 */

/**
 * Constructeur de blockVideo
 * @param {double} x               : la position en X du bloc (pourcentage)
 * @param {[double} y              : la position en Y du bloc (pourcentage)
 * @param {[double]} w             : la largeur du bloc (pourcentage)
 * @param {[double]} h             : la hauteur du bloc (pourcentage)
 * @param {[string]} content       : le contenu de la vidéo
 */
var BlockVideo = function (x, y, w, h, content) {
	Block.call (this, x, y, w, h);
	this.content = content;
	this.type = "Video";
}

// Héritage
BlockVideo.prototype = new Block();


/**
 * Returne l'aspect HTML de ce bloc (dans l'éditeur)
 * @return {HTML}
 */
BlockVideo.prototype.toHTML = function () {
  var res = "<div style='left: " + this.posX + "%; top: " + this.posY + "%; width: " + this.width + "%; height: " + this.height + "%;' class='bloc blockVideo ui-widget-content' id='block-" + this.id + "'>";
  res += "<video class='video_class' controls>";
  res += "<source src='" + this.content + "'>"
  res += "</video>";
  res += "</div>";
  return res;
}

/**
 * Retourne l'aspect HTML de ce bloc (pour l'export)
 * @return {HTML}
 */
BlockVideo.prototype.exportHTML = function () {
  var res = "<div class='block blockVideo' style='left: " + this.posX + "%; top: " + this.posY + "%; width: " + this.width + "%; height: " + this.height + "%';>";
  res += "<video class='video_class' controls>";
  res += "<source src='" + this.content + "'>"
  res += "</video>";
  res += "</div>";
  return res;
}

/**
 * Retourne un clone de ce bloc
 * @return {Block} clone
 */
BlockVideo.prototype.clone = function () {
  var o = new BlockVideo();
  Block.call(o, this.posX, this.posY, this.width, this.height);
  o.content = this.content;
  o.type = this.type;
  return o;
}

