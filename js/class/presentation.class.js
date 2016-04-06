/**
 * Classe représentant une présentation
 */

/**
 * Constructeur de Presentation
 * @param {string} titre : le titre de la présentation
 */
var Presentation = function (titre) {
  this.titre = titre;
  this.slides = [];
}

/**
 * Ajoute une slide à la présentation
 * @param {slide} slide : la slide à ajouter
 */
Presentation.prototype.addSlide = function (slide) {
  this.slides.push(slide);
}

/**
 * Supprime une slide de la présentation
 * @param  {slide} slide : la slide à supprimer
 */
Presentation.prototype.removeSlide = function (slide) {
  var index = this.slides.indexOf(slide);
  if (index != -1) {
    this.slides.splice(index, 1);
  }
}


/**
 * Retourne une slide de cette présentation
 * @param  {int} idSlide : l'ID de la slide
 * @return {Block}
 */
Presentation.prototype.getSlideById = function (idSlide) {
  for (var i = 0; i < this.slides.length; i++) {
    if (this.slides[i].id == idSlide) return this.slides[i];
  }
}

/**
 * Retourne un bloc de cette présentation
 * @param  {int} idBlock : l'ID du block
 * @return {Block}
 */
Presentation.prototype.getBlockById = function (idBlock) {
  for (var i = 0; i < this.slides.length; i++) {
    for (var j = 0; j < this.slides[i].blocks.length; j++) {
      if (this.slides[i].blocks[j].id == idBlock) {
        return this.slides[i].blocks[j];
      }
    }
  }
}

/**
 * Retourne cette présentation sous format HTML
 * @return {HTML
 */
Presentation.prototype.export = function () {
  // on trie les slides par position avant de commencer
  this.slides.sort(function (a, b) {
    return a.position - b.position;
  })
  var liste_slides = "";
  for (var i = 0; i < this.slides.length; i++) {
    var slide = this.slides[i];
    liste_slides += "<div class='slide' style='background-image:url(" + slide.background + ")''>";
    for (var j = 0; j < slide.blocks.length; j++) {
      var bloc = slide.blocks[j];
      liste_slides += bloc.exportHTML();
    }
    liste_slides += "</div>";
  }
  var html = "<!doctype html>";
  html +=     "<html>";
  html +=     "<head>";
  html +=       "<meta charset='utf-8'>";
  html +=       "<title>" + this.titre + "</title>"
  html +=       "<script>" + decodeURIComponent(JQUERY_VAR) + "</script>";
  html +=       "<script>" + decodeURIComponent(FULLSCREEN_VAR) + "</script>";
  html +=       "<script>" + decodeURIComponent(SCRIPT_VAR) + "</script>";
  html +=       "<style>";
  html +=         "@font-face { font-family: 'Open Sans'; src: url('OpenSans-Regular.ttf'); }";
  html +=         "* { margin: 0; padding: 0; overflow: hidden; }";
  html +=         "body { font-size: 2vw; font-family: 'Open Sans', monospace }";
  html +=         "h1 { text-align: center; }";
  html +=         "h1 b { text-align: center; }";
  html +=         ".slide { width: 100vw; height: 100vh; border: 1px dotted #000; position: relative; background: no-repeat center fixed; background-size: cover; }";
  html +=         ".slideCentre { padding-top: 40vh; text-align: center; }";
  html +=         ".buttonIntro { clear: both; width: 20%; padding: 1%; background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.6), rgba(220, 220, 220, 0.6)); border: 1px solid rgba(0, 0, 0, 0.5); border-radius: 5px; margin: auto; display: block; }";
  html +=         ".buttonIntro:hover { cursor: pointer; background-image: linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(220, 220, 220, 0.6)); }";
  html +=         ".block { position: absolute; }";
  html +=         ".imageclass { width: 100%; height: 100% }";
  html +=         ".imageclass img { width: 100%; height: 100%; }";
  html +=         ".table_class { border-collapse: collapse; width: 100%; height: 100%; table-layout: fixed; }";
  html +=         ".table_class td, .table_class th { border: 1px solid black; width: 2%; text-align: center; word-wrap: break-word; }";
  html +=         ".video_class { width: 100%; height: 100%; }";
  html +=         ".legend { width: 100%; position: absolute; bottom: 0; word-wrap: break-word; }";
  html +=         ".legend_black { background-color: rgba(0, 0, 0, 0.7); color: #fff; }";
  html +=         ".legend_white { background-color: rgba(255, 255, 255, 0.7); color: #000; }";
  html +=         ".oneline { position: relative; text-align: justify; }";
  html +=         ".oneline:after { content:''; display:inline-block; width:100%; }";
  html +=        "</style>";
  html +=     "</head>";
  html +=     "<body>";
  html +=       "<div class='slide start slideCentre'>";
  html +=         "<button class='buttonIntro' onclick='startPresentation()'>Commencer la présentation</button>";
  html +=       "</div>";
  html +=       liste_slides;
  html +=       "<div class='slide slideCentre'>";
  html +=         "<h1>FIN</h1>";
  html +=         "<button class='buttonIntro' onclick='stopPresentation()'>Quitter le plein écran</button>";
  html +=       "</div>";
  html +=     "</body>";
  html +=     "</html>";

  return html;
}
