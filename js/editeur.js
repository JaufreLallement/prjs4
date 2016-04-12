// JavaScript jQuery Projet S4 Editeur.

/**
*	Cette page contient les scripts de l'éditeur.
*/

/* -------------------------------------- VARIABLES GLOBALES -------------------------------------- */
var pres = new Presentation('Ma Présentation'); // Nouvelle présentation.

SELECTEDSLIDE = null; // Slide actuellement sélectionnée (graphique)
NBSLIDE = $("#slide-list").length; // Nombre de slides
SELECTEDSLIDETITLE = '';
EDITING = false; // Statut, true si l'édition d'une slide est en cours, false sinon.
EDITING_TITLE = false; // true si l'édition du titre est en cours, false sinon.
DRAG = false; // true si une slide est en train d'être déplacée, false sinon.
CURRENT_SLIDE = null; // slide actuellement sélectionnée (objet)
/* -------------------------------------- FIN VARIABLES GLOBALES -------------------------------------- */




/* -------------------------------------- GESTION DE LA GENERATION DE FICHIERS -------------------------------------- */
/**
   * Génération d'un fichier téléchargeable
   * @param {[string]} text : le contenu du fichier
   * @return {[string]} le chemin du fichier
   */
  var textFile = null;
  makeTextFile = function (text) {
    var data = new Blob([text], {type: 'text/json'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    return textFile;
  };
/* -------------------------------------- FIN GESTION DE LA GENERATION DE FICHIERS -------------------------------------- */




/* -------------------------------------- GESTION DES POPUPS -------------------------------------- */
/**
* Fonction permettant de gérer la fermeture d'une popup.
* @return {void}
*/
function closePopup() {
	$(".popup").hide(); // On cache les popups

	$("input").val(''); // Réinitialisation de la valeur de l'input.
	$("textarea").jqteVal(''); // Réinitialisation de la valeur de la textarea.

	$(".error").hide(); // On cache le message d'erreur.
	$("#shade").hide(); // On cache l'ombre.
	majAffichage();

	$(".uploadButton").removeClass('green red');
	$(".valid").removeAttr('disabled');

	$("#idbloc").remove();
	$("#num_ligne").remove();
	$("#num_colonne").remove();
}


/**
* Fonction permettant de gérer l'affichage d'une popup générique.
* @param {int} id : identifiant de la popup à afficher.
* @return {void}
*/
function showPopup(id) {
	var popup = $("#" + id); // Popup en fonction de l'id passé en paramètre.
	popup.show(); // On affiche la popup.

	switch(id) {
		case "text-popup":
			$(".jqte_editor").focus();
			break;
		case "suppr-popup":
			$("#suppr-popup").focus();
			break;
		case "array-popup":
			$("#nRows").focus();
			break;
		case "picture-popup":
			$(".jqte_editor").focus();
			break;
		case "video-popup":
			$(".jqte_editor").focus();
			break;
		case "picture-popup-edit":
			$("#picture-url-edit").focus();
			break;
		case "text-popup-edit":
			$(".jqte_editor").focus();
			break;
		default:
			popup.find("form input:first-of-type").focus();
	}

	$("#shade").show(); // Affichage de l'ombre.
}


/**
 * Fonction qui affiche la popup d'initialisation du titre de la présentation.
 * @return {void}
 */
function showTitlePopup() {
	$("#title-popup").show(); // Affiche la popup d'initialisation du titre de la présentation.
	$("#title-input").focus();
	$("#shade").show(); // Affichage de l'ombre.
}


/**
 * Fonction qui crée et affiche la popup d'édit d'un bloc de texte
 * @param  {int} idBloc : l'ID du bloc de texte à éditeur
 * @return {void}
 */
function popEditText(idBloc) {
  showPopup("text-popup-edit"); // On affiche la popup de modification du bloc texte.
	var valBloc = pres.getBlockById(idBloc).text; // Texte compris dans le bloc.

	$("#text-popup-edit textarea").jqteVal(valBloc); // On insère le texte du bloc dans la textarea de modification.

	if ($("#idbloc").length == 0) {
		$("#text-form-edit").append("<input type='hidden' id='idbloc' value=" + idBloc + ">"); // id du bloc en cours d'édition en champ caché dans le formulaire
	}
}


/**
 * Fonction qui crée et affiche la popup d'édit d'un bloc d'image
 * @param  {int} idBloc : l'ID du bloc de texte à éditeur
 * @return {void}
 */
function popEditPicture(idBloc) {
  showPopup("picture-popup-edit") // On affiche la popup de modification du bloc texte.
	var legende_prec = pres.getBlockById(idBloc).desc; // Légende précédente de l'image

	$("#picture-popup-edit .text-area").jqteVal(legende_prec); // On insère la légénde précédente

	if ($("#idbloc").length == 0) {
		$("#picture-form-edit").append("<input type='hidden' id='idbloc' value=" + idBloc + ">"); // id du bloc en cours d'édition en champ caché dans le formulaire
	}

}
/* -------------------------------------- FIN GESTION DES POPUPS -------------------------------------- */




/* -------------------------------------- GESTION DU TITRE -------------------------------------- */
/**
 * Cette fonction permet d'éditer le titre de la présentation.
 * @return {void}
 */
function editTitle() {
	EDITING_TITLE = true;
	var currentTitle = $("#title").text();
	currentTitle = currentTitle.replace(/[']/g, '&apos;');

	$("#title").html("<input value='" + currentTitle + "'>"); // On remplace par un input.

	var newTitleInput = $("#title").find("input");

	newTitleInput.focus();
	newTitleInput[0].setSelectionRange(currentTitle.length, currentTitle.length);

	newTitleInput.bind('keydown', function(e) {
		if (e.keyCode == 13) {
			var newTitle = newTitleInput.val();

			if (newTitle != '') {
				$("#title").html(newTitle);
				pres.titre = newTitle;
			} else {
				$("#title").html(currentTitle);
			}
			EDITING_TITLE = false;
		} else if (e.keyCode == 27) {
			$("#title").html(currentTitle);
			EDITING_TITLE = false
		}
	});

}
/* -------------------------------------- FIN GESTION DU TITRE -------------------------------------- */





/* -------------------------------------- GESTION DES SLIDES -------------------------------------- */
/**
* Fonction permettant d'ajouter une slide à l'interface
* ainsi que de l'ajouter aux données de la présentation.
* @return {void}
*/
function addSlide () {
	var title = $("#slide-title").val();
	var lastSlide = $("#slide-list li").last();
	var newSlideIndex = Slide.lastId;

	var slide = new Slide(title, newSlideIndex);
	pres.addSlide(slide);

	if (title != "") {
		$("#slide-list").append("<li id='slide-" + newSlideIndex + "'>" + title + "</li>"); // On ajoute un élément li qui correspond à une nouvelle slide.

		var lastSlide = $("#slide-list li").last(); // On réupère la dernière slide créée.

		selectSlide(lastSlide); // On définit la dernière slide créée comme étant selected.
		NBSLIDE++; // On incrémente le nombre de slide.
		closePopup(); // Fermeture de la popup.
	} else {
		$("#slide-popup .error").slideDown(350); // Affichage de l'erreur.
	}
}


function updateSlideList (){
  $("#slide-list").empty();
  for(var i=0;i<pres.slides.length;i++){
    var slide = pres.slides[i];
    $("#slide-list").append("<li id='slide-" + slide.id + "'>" + slide.titre + "</li>"); // On ajoute un élément li qui correspond à une nouvelle slide.
  }
  selectSlide($("#slide-list li").first());
}

/**
* Fonction permettant d'ajouter une slide à l'interface
* ainsi que de l'ajouter aux données de la présentation.
* @param {Object:html} slide : slide à modifier.
* @return {void}
*/
function editSlide (slide) {
	var slideTitle = slide.text(); // On récupère le titre de la slide.
	SELECTEDSLIDETITLE = slideTitle;
	EDITING = true; // Une slide est en cours d'édition.

	selectSlide(slide);

	slide.html("<input value='" + slideTitle + "'>"); // On remplace par un input.

	var slideInput = slide.find("input"); // On récupère l'input.

	slideInput.focus();
	slideInput[0].setSelectionRange(slideTitle.length, slideTitle.length);

	slideInput.bind('keydown', function(e) {
		var newTitle = slide.find("input").val(); // Si on presse entrée, le nouveau titre prend la valeur de l'input.

		if (e.keyCode == 13) {
			if (newTitle != '') {
				pres.getSlideById($(slide).attr("id").substr(6)).titre = newTitle;
				slide.html(pres.getSlideById($(slide).attr("id").substr(6)).titre); // On ajoute le nouveau titre.
			} else {
				slide.html(slideTitle); // Si aucun texte n'a été entré, on réinitialise le titre.
			}

			selectSlide(slide);
			EDITING = false; // La slide n'est plus en cours d'édition.

		} else if (e.keyCode == 27) {
			slide.html(slideTitle); // On sort de l'édition.
			EDITING = false; // Edition terminée.
		}
	});

	$("#slide-list li").on('click', function(e) {
		if ($(this).index() != slide.index() && EDITING) {
			slide.html(slideTitle);	 // On sort de l'édition.
			EDITING = false; // Edition terminée.
		}
	});
}


/**
* Fonction permettant d'annuler la modification d'une slide.
* @param {Object:html} slide : slide à réinitialiser.
* @param {string} title : titre de la slide.
* @return {void}
*/
function cancelSlideEdit(slide, title) {
	slide.html(title); // On attribue à la slide son titre d'origine ou son nouveau titre.
	EDITING = false; // Edition terminée.
}


/**
* Fonction permettant de sélectionner une slide de l'interface.
* @param {Object:html} slide : slide sélectionnée.
* @return {void}
*/
function selectSlide (slide) {
		$("#slide-list li[selected='selected']").removeAttr('selected'); // Suppression de tous les attributs selected.

		SELECTEDSLIDE = slide; // On attribue slide à la slide sélectionnée.
		SELECTEDSLIDE.focus();
		SELECTEDSLIDE.attr('selected', 'true'); // On passe le paramètre selected à true.

		var slide_object = pres.getSlideById($(slide).attr("id").substr(6)); // On récupère l'objet logique de la slide nouvellement sélectionnée
	    if (typeof slide_object != "undefined") $("#current-slide").html(slide_object.toHTML());

	    CURRENT_SLIDE = slide_object;
	    majDrag();
	    listenersARefresh();
	    majAffichage();
}


/**
* Fonction permettant de supprimer une slide de l'interface
* ainsi que de la supprimer des données de la présentation.
* @param {Object:html} slide: slide à supprimer.
* @return {void}
*/
function deleteSlide (slide) {
	var slide_object = pres.getSlideById(slide.attr("id").substr(6));
	var index = $("#slide-list li").index(slide); // index de la slide à supprimer.
	var lastSlide = $("#slide-list li").last();
	var lastSlideIndex = $("#slide-list li").index(lastSlide);

	if (index == lastSlideIndex) {
		index--; // Si l'index de la slide sélectionnée est égal à l'index de la dernière slide, la prochaine slide sélectionnée sera l'actuelle avant-dernière.
	}

	if (NBSLIDE - 1 >= 1) { // On s'assure qu'il reste toujours au moins une slide.
		slide.remove(); // Suppression de la slide sélectionnée.
		NBSLIDE--; // On décrémente le nombre de slide.
		pres.removeSlide(slide_object); // On supprime la slide des données.
		closePopup(); // Fermeture de la popup.
	} else {
		$("#suppr-popup .error").slideDown(350); // Affichage de l'erreur.
	}

	var newSelectedSlide = $("#slide-list li").eq(index);
	selectSlide(newSelectedSlide); // On réinitialise la slide sélectionnée.
}


/**
 * Fonction ajoutant un bloc à une slide
 * @param {Slide} slide_object    : la slide à laquelle ajouter le bloc (sous forme objet)
 * @param {string} type           : type de bloc
 * @param {content} blockContent  : contenu du bloc
 * @param {content} blockContent2 : deuxieme contenu (optionnel)
 */
function addBlock(slide_object, type, blockContent, blockContent2, blockContent3) {
	if (type == "text") {
		var b = new BlockText(0, 0, 20, 20, blockContent);
		slide_object.addBlock(b);
	} else if (type == "image") {
    var b = new BlockPicture(0, 0, blockContent, blockContent2, blockContent3);
		slide_object.addBlock(b);
	} else if (type == "video") {
		var b = new BlockVideo(0, 0, 20, 20, blockContent, blockContent2);
		slide_object.addBlock(b);
	} else if (type == "tableau") {
		var b = new BlockArray(0, 0, 20, 20, blockContent);
		slide_object.addBlock(b);
	}

  return b;
}

/**
 * Met à jour l'affichage du background avec les données d'un nouveau fond
 * @param  {data URI} newBackground : les données du nouveau background
 * @return {void}
 */
function changeCurrentBackground (newBackground) {
  $("#currentBG").remove();
  var back = "<div id='currentBG' style='position: absolute; left: 0%; top: 0%; width: 100%; height: 100%; z-index: -1'>";
  back += "<div class='imageclass'><img src='" + newBackground + "'></div>";
  back += "</div>";
  $("#current-slide").append(back);
}

/**
 * Met à jour l'affichage des slides
 * @return {void}
 */
function majAffichage() {
	$("#current-slide").html(CURRENT_SLIDE.toHTML());
	changeCurrentBackground (CURRENT_SLIDE.background);
	listenersARefresh();
	majDrag();
}


/**
 * Met à jour les attributs "position" de toutes les slides pour correspondre à l'affichage graphique
 * @return {void}
 */
function majPosition() {
  for (var i = 0; i < $("#slide-list").children("li").length; i++) {
    var idSlide = $("#slide-list").children("li")[i].id.substr(6);
    pres.getSlideById(idSlide).position = i;
  }
}


/**
 * Permet de dupliquer la slide courante.
 * @return {void}
 */
function dupliquer() {
  var newSlideIndex = Slide.lastId;
  var nvSlide = CURRENT_SLIDE.clone();
  // ajout dans les objets :
  pres.addSlide(nvSlide);

  // ajout dans l'interface :
  $("#slide-list").append("<li id='slide-" + newSlideIndex + "'>" + nvSlide.titre + "</li>");
  NBSLIDE++;
  listenersARefresh();
}
/* -------------------------------------- FIN GESTION DES SLIDES -------------------------------------- */




/* -------------------------------------- GESTION DES ARRAYS -------------------------------------- */
/**
* Fonction permettant d'ajouter un bloc tableau.
* @return {void}
*/
function addArray() {
	var nRows = $("#nRows").val(); // nombre saisi dans l'input nRows.
	var nCols = $("#nCols").val(); // nombre saisi dans l'input nCols.
	var arrayError = $("#array-popup .error");

	if (nRows > 30 || nCols > 30) {
		arrayError.html('Le nombre de lignes et de colonnes ne peut pas dépasser 30.');
		arrayError.slideDown(350);
	} else if (nRows <= 0 || nCols <= 0) {
		arrayError.html('Le nombre de lignes et de colonnes ne peut être inférieur à 1.');
		arrayError.slideDown(350);
	} else {
		var ar = createArray(nRows, nCols); // On appelle la fonction de création d'un tableau.
	    var b = addBlock(CURRENT_SLIDE, "tableau", ar)
	    // MAJ de l'affichage et des données de position/taille du nv bloc
	    majAffichage();
	    majSize($("#block-" + b.id));
	    majPos($("#block-" + b.id));
		closePopup(); // Fermeture de la popup.
	}
}


/**
* Fonction permettant de générer un tableau en fonction du nombre de lignes et du nombre de cononnes.
* @param {int} nRows : nombre de lignes.
* @param {int} nCols: nombre de colonnes.
* @return {array}
*/
function createArray(nRows, nCols) {
	var array = new Array(); // On crée un nouveau tableau.

	for (i = 0; i < nRows; i++) {
		var array2 = new Array(nCols);

		for (j = 0; j < nCols; j++) {
			array2[j] = '';
		}

		array[i] = array2;
	}
	return array;
}


/**
* Fonction permettant d'afficher la popup d'édition d'une cellule de tableau.
* @param {int} idBloc : id du bloc.
* @param {int} ligne: position de la cellule (ligne)
* @param {int} colonne: position de la cellule (colonne)
* @return {void}
*/
function popEditTableCell(idBloc, ligne, colonne) {
  showPopup("table-edit");
  var valCell = pres.getBlockById(idBloc).content[ligne][colonne];
  $("#table-edit textarea").jqteVal(valCell); // On insère le texte de la cellule dans la textarea de modification.

  // Ajout des infos cachées : id du bloc, numéro de la ligne, numéro de la colonne
  if ($("#idbloc").length == 0) {
		$("#table-form-edit").append("<input type='hidden' id='idbloc' value=" + idBloc + ">");
	}
  if ($("#num_ligne").length == 0) {
		$("#table-form-edit").append("<input type='hidden' id='num_ligne' value=" + ligne + ">");
	}
  if ($("#num_colonne").length == 0) {
		$("#table-form-edit").append("<input type='hidden' id='num_colonne' value=" + colonne + ">");
	}
}
/* -------------------------------------- FIN GESTION DES ARRAYS -------------------------------------- */





/* -------------------------------------- GESTION DES BLOCS -------------------------------------- */
function majDrag() {
  $(".bloc").draggable({
                containment: "#current-slide",
                stop: function() {
                  majPos($(this));
                  changerSelection($(this));
                }
            })
            .resizable({
                containment: "#current-slide",
                handles: "n, e, s, w, ne, se, sw, , nw",

                stop: function() {
                  majSize($(this))
                }
            })
            .on("click", function(e) {
              e.stopPropagation();
              changerSelection($(this));
            });
}


/**
 * Change le bloc actuellement sélectionné
 * @param  {DOM} nvSelection : le nouveau bloc sélectionné
 * @return {[void]}
 */
function changerSelection(nvSelection) {
  if (!($(nvSelection).is(BLOCK_SELECTIONNE))) {
    $(nvSelection).addClass("selection");
    $(BLOCK_SELECTIONNE).removeClass("selection");
    BLOCK_SELECTIONNE = $(nvSelection)
  }
}


/**
 * Met à jour la taille d'un objet (logique) en récupérant sa taille dans le DOM
 * @param  {DOM} bloc_dom
 * @return {[void]}
 */
function majSize(bloc_dom) {
	var bloc_objet = pres.getBlockById($(bloc_dom).attr("id").substr(6));

	var width_px_bloc = parseFloat($(bloc_dom).css("width"));
	var width_px_editeur = parseFloat($("#current-slide").css("width"));
	var width_percent_bloc = (width_px_bloc / width_px_editeur) * 100;

	var height_px_bloc = parseFloat($(bloc_dom).css("height"));
	var height_px_editeur = parseFloat($("#current-slide").css("height"));
	var height_percent_bloc = (height_px_bloc / height_px_editeur) * 100;

	bloc_objet.width = width_percent_bloc;
	bloc_objet.height = height_percent_bloc;
}


/**
 * Met à jour la position d'un objet (logique) en récupérant sa position dans le DOM
 * @param  {DOM} bloc_dom
 * @return {[void]}
 */
function majPos(bloc_dom) {
	var bloc_objet = pres.getBlockById($(bloc_dom).attr("id").substr(6));

	var posX_px = bloc_dom.position().left;
	var width_px_editeur = parseFloat($("#current-slide").css("width"));
	var posX_percent = (posX_px / width_px_editeur) * 100;

	var posY_px = bloc_dom.position().top;
	var height_px_editeur = parseFloat($("#current-slide").css("height"));
	var posY_percent = (posY_px / height_px_editeur) * 100;

	bloc_objet.posX = posX_percent;
	bloc_objet.posY = posY_percent;
}


/**
 * Listeners a refresh à chaque maj de l'affichage
 * @return {void}
 */
function listenersARefresh() {
	// Edite les blocs de texte en double cliquant dessus
	$(".blockText").on("dblclick", function (e) {
		popEditText($(this).attr("id").substr(6));
	});

	// Edite les blocs d'image
  $(".blockPicture").on("dblclick", function (e) {
		popEditPicture($(this).attr("id").substr(6));
	});

  // Edite une cellule d'un tableau
  $(".table_class td, .table_class th").on("dblclick", function (e) {
    var id_block_tableau = $(this).parent().parent().parent().parent().attr("id").substr(6);
    var ligne = $(this).parent().index();
    var colonne = $(this).index();
    popEditTableCell(id_block_tableau, ligne, colonne);
  });
}
/* -------------------------------------- FIN GESTION DES BLOCS -------------------------------------- */





/* -------------------------------------- GESTION DES LISTENERS, ETC. -------------------------------------- */
$(document).ready(function() {

	setInterval(function () {
	   var largeur = $("#current-slide").width();
	   $("#current-slide").height(largeur * 9 / 16);

     var nb = largeur / 50;
     $("#current-slide").css("font-size", nb + "px");
	}, 10);

	// Création de la slide par défaut
	// 1. partie graphique
	$("#slide-list").append("<li id='slide-0'>1</li>");
	NBSLIDE++;

	// 2. partie logique
	var s = new Slide('1', 0);
	pres.addSlide(s);
	changeCurrentBackground (s.background);

	selectSlide($("#slide-list li").first());

	var wWidth = $(document).width();
	var wHeight = $(document).height();


	var popups = $(".popup"); // Ensemble des popups.
	var slideT = $("#slide-title"); // Champ d'initialisation du titre de slide.

	// Boutons et liens
	var close = $(".close, #shade"); // Les élements permettant la fermeture des popups.

	// On cache les différentes popups.
	popups.hide(); // On cache les popups.
	showTitlePopup(); // Popup d'initialisation du titre de la présentation.


	// On évite le rechargement de la page.
	$("form").submit(function(e) {
		e.preventDefault();
	});


	// Gestion de l'édition du background.
	$("#change-background").on('click', function() {
		showPopup('background-popup');
	});


	// Gestion de la touche entrée pour l'ajout de slide.
	slideT.bind('keydown', function(e) {
		if (e.keyCode == 13) {
			addSlide(); // Ajout d'une slide.
		}
	});


	listenersARefresh();


	$(document).bind('keydown', function(e) {
		if (e.keyCode == 46) {
			var bloc_objet = pres.getBlockById($(BLOCK_SELECTIONNE).attr("id").substr(6)); //
			CURRENT_SLIDE.removeBlock(bloc_objet);
			$(BLOCK_SELECTIONNE).remove();
			BLOCK_SELECTIONNE = null;
		}
	});


	// Gestion de la touche entrée pour l'initialisation du titre.
	$("#title-input").bind('keydown', function(e) {
		if (e.keyCode == 13) {
			if ($("#title-input").val() != '' && $("#title-input").val() != null) {
				pres.titre = $("#title-input").val();
				$("#title").html(pres.titre);
				closePopup();
			} else {
				$("#title-popup .error").slideDown(350);
			}

		}
	});


	// Gestion du clic pour l'initialisation du titre.
	$("#valid-title").on('click', function(e) {
		if ($("#title-input").val() != '' && $("#title-input").val() != null) {
			pres.titre = $("#title-input").val();
			$("#title").html(pres.titre);
			closePopup();
		} else {
			$("#title-popup .error").slideDown(350);
		}
	});


	// Gestion du double-clic sur le titre
	$("#title").on('dblclick', function(e) {
		if (EDITING_TITLE) {
			e.preventDefault();
		} else {
			editTitle();
		}
	});


	// Gestion de la touche entrée pour l'ajout de tableau.
	$("#nRows, #nCols").bind('keydown', function(e) {
		if (e.keyCode == 13) {
			addArray(); // Ajout d'un tableau.
		}
	});


	// Gestion de la sélection d'une slide
	$("#slide-list").on('click', 'li', function(e) {
		var slide = $(this); // On récupère la slide sur laquelle on a cliqué.
		selectSlide(slide); // On appel la fonction de sélection d'une slide.
	});


	$("html").on('click', function(e) {
		if (EDITING) {
			if (e.target.tagName.toUpperCase() != 'INPUT') {
				cancelSlideEdit(SELECTEDSLIDE, SELECTEDSLIDETITLE); // On quitte l'édition.
			}
		}
		if (EDITING_TITLE) {
			if (e.target.tagName.toUpperCase() != 'INPUT') {
				$("#title").html(pres.titre);
				EDITING_TITLE = false;
			}
		}
	});


	// Gestion du clic sur le bouton de validation de texte.
	$("#valid-text").on('click', function(e) {
		var blockContent = $("#text-form .jqte_editor").html();

		var b = addBlock(CURRENT_SLIDE, "text", blockContent); // Ajout du bloc
    	// MAJ de l'affichage et des données de position/taille du nv bloc
		majAffichage();
	    majSize($("#block-" + b.id));
	    majPos($("#block-" + b.id));
		closePopup();// Fermeture de la popup
	});


	// Gestion du clic sur le bouton de validation d'édition d'un texte
	$("#valid-text-edit").on('click', function(e) {
		var blockContent = $("#text-form-edit .jqte_editor").html();
		var block = pres.getBlockById($("#idbloc").val());

		block.text = blockContent; // MAJ du bloc

		majAffichage(); // MAJ de l'affichage

		$("#idbloc").remove(); // Fermeture de la popup
		closePopup();
	});


	// Gestion du clic sur le bouton de validation de création d'un tableau.
	$("#valid-array").on('click', function(e) {
		addArray(); // création d'un tableau
	});


	// Gestion du double clic pour les slides.
	$("#slide-list").on('dblclick', 'li', function(e) {
		var slide = $(this); // On récupère la slide sur laquelle on a double-cliqué.
		if (EDITING == false) {
			editSlide(slide); // On appel la fonction d'édition d'une slide.
		} else {
			e.preventDefault(); // On empêche les conflits.
		}
	});


	// Gestion de la fermeture d'une popup.
	close.on('click', function() {
		$("#white-shade").hide();
		closePopup(); // Fermeture des popups.
	});


	// Ajout d'une slide.
	$("#valid-slide").on('click', function() {
		addSlide(); // Ajout d'une slide.
	});


	// Suppression d'une slide
	$("#valid-suppr").on('click', function() {
		deleteSlide(SELECTEDSLIDE); // Suppression d'une slide.
	});


	$("#cancel-suppr").on('click', function() {
		closePopup(); //Fermeture des popups.
	});


	// Gestion formulaire image/video
	$(".uploadButton").on('click', function() {
		$(this).next("[type=file]").click();
	});


	$(".openButton").on('click', function() {
		$(this).next("[type=file]").click();
	});

	$("#lfc").on('click',function(){
		closePopup();
	});

	// Gestion de la sauvegarde en JSON
	$("#save-pres").on('click', function() {
    majPosition();

		var save = JSON.stringify(pres);
		$("#dl-pres").prop('download', pres.titre + '.json');
		$("#dl-pres").prop('href', makeTextFile(save));

	});


	// Gestion de l'export en HTML'
	$("#export-pres").on('click', function() {
	    // MAJ des positions avant d'exporter
	    majPosition();

		var exp = pres.export();

		$("#exp-pres").prop('download', pres.titre + '.html');
		$("#exp-pres").prop('href', makeTextFile(exp));

    window.location.href = "css/fonts/OpenSans-Regular.ttf";

	});


	// Gestion du clic sur le bouton de validation d'édition d'une cellule de tableau
	$("#valid-table-edit").on('click', function(e) {
		var blockContent = $("#table-form-edit .jqte_editor").html();
		var block = pres.getBlockById($("#idbloc").val());
	    var ligne = $("#num_ligne").val();
	    var colonne = $("#num_colonne").val();

		block.content[ligne][colonne] = blockContent; // MAJ du bloc

		majAffichage(); // MAJ de l'affichage

	    // Fermeture de la popup
		$("#idbloc").remove();
	    $("#num_ligne").remove();
	    $("#num_colonne").remove();
		closePopup();
	});


/* -------------------------------------- GESTION DES PLUGINS -------------------------------------- */
	// Gestion des slides sortable.
	$(document).bind('keyup', function(e) {
		if (!e.ctrlKey) {
			$("#slide-list li").css({"cursor":"pointer"});
			$( ".sortable" ).sortable();
			$( ".sortable" ).sortable("disable");
			if (DRAG) { $( ".sortable" ).sortable("cancel"); }
		}
	}).bind('keydown', function(e) {
		if (e.ctrlKey) {
			$("#slide-list li").css({"cursor":"move"});

			$(".sortable").sortable({
				start: function(event, ui) {
					DRAG = true;
				},
				stop: function(event, ui) {
					DRAG = false;
				}
			});
			$(".sortable").sortable("option", "disabled", false);
		}
	});

	// Gestion de l'ajout de texte.
	$(".text-area").jqte({
    funit: "%",
    fsizes: ["100", "150", "200", "250"]
  });

	// Ajout des titles sur les jqte.
	$("#text-popup .jqte").attr('title', 'Ecrivez votre texte ici');
	$("#picture-popup .jqte").attr('title', 'Description de votre image');
	$("#video-popup .jqte").attr('title', 'Description de votre video');

	$(function(){

		// Flèche vers la gauche, texte à droite
        $( "#slides-container, #ajout-slide, #suppr-slide, #dupl-slide" ).tooltip({
            position: {
                my: "right center",
                at: "left-10 center",
                using: function( position, feedback ) {
                    $( this ).css( position );
                    $( "<div>" )
                    .addClass( "arrow-right" )
                    .addClass( feedback.vertical )
                    .addClass( feedback.horizontal )
                    .appendTo( this );
                }
            },
            show:{delay:500}
        });


        // Flèche vers le bas, texte en haut, décalé.
        $( ".jqte_editor" ).tooltip({
            position: {
                my: "left right",
                at: "left-20 top+10",
                using: function( position, feedback ) {
                    $( this ).css( position );
                    $( "<div>" )
                    .addClass( "arrow" )
                    .addClass( feedback.vertical )
                    .addClass( feedback.horizontal )
                    .appendTo( this );
                }
            },
            show:{delay:500},
            open: function (event, ui) {
	            setTimeout(function () {
	                $(ui.tooltip).hide('fade');
	            }, 3000);
	        }
        });


        // Flèche vers la droite, texte à gauche.
        $( "#bloc-list li, #title-input, #slide-title" ).tooltip({
            position: {
                my: "right center",
                at: "left-10 center",
                using: function( position, feedback ) {
                    $( this ).css( position );
                    $( "<div>" )
                    .addClass( "arrow-left" )
                    .addClass( feedback.vertical )
                    .addClass( feedback.horizontal )
                    .appendTo( this );
                }
            },
            show:{delay:500}
        });


        // Flèche vers le haut, texte en bas
        $( "#open-existing-pres, #new-pres-link, #open-pres, #dl-pres, #export-pres, #title, #current-slide, #change-background" ).tooltip({
            position: {
                my: "center top+20",
                at: "center bottom",
                using: function( position, feedback ) {
                    $( this ).css( position );
                    $( "<div>" )
                    .addClass( "arrow" )
                    .addClass( feedback.vertical )
                    .addClass( feedback.horizontal )
                    .appendTo( this );
                }
            },
            show:{delay:500}
        });


        // Flèche vers le bas, texte en haut
        $( "#bg-descPicture-selector" ).tooltip({
            position: {
                my: "center bottom",
                at: "center top-15",
                using: function( position, feedback ) {
                    $( this ).css( position );
                    $( "<div>" )
                    .addClass( "arrow" )
                    .addClass( feedback.vertical )
                    .addClass( feedback.horizontal )
                    .appendTo( this );
                }
            },
            show:{delay:500}
        });

    });
/* -------------------------------------- FIN GESTION DES PLUGINS -------------------------------------- */



	// Sécurité sur la sélection d'un fichier image pour l'ajout ou l'édition d'un BlockPicture.
	$("#picture-file, #picture-file-edit").on('change', function() {
		var filePath = $(this).val();
		var isPicture = filePath.includes('.png') || filePath.includes('.jpg') || filePath.includes('.jpeg') || filePath.includes('.bmp') || filePath.includes('.gif');

		if ((filePath == null) && (filePath == '') || (isPicture == false)) {
			$(".uploadButton").removeClass('green');
			$(".uploadButton").addClass('red');
			$(".valid").attr('disabled', 'disabled');
			$("#picture-popup .error, #picture-popup-edit .error").html('Le format de l\'image doit être png, jpg, jpeg, bmp ou gif.');
			$("#picture-popup .error, #picture-popup-edit .error").slideDown(350);
		} else {
			$(".uploadButton").removeClass('red');
			$(".uploadButton").addClass('green');
			$("#picture-popup .error, #picture-popup-edit .error").slideUp(350);
			$(".valid").removeAttr('disabled')
		}
	});


	// Gestion de la séléction d'un fichier image lors de la création d'un BlockPicture.
  	$("#valid-picture").on('click', function(e) {
      $(".loading-screen").show();
	    var error = $("#picture-popup .error");
	    var input = $("#picture-file")[0];

	    var colLeg = $("#bg-descPicture-selector").val();
	    var fondLegende = (colLeg == "noir") ? true : false;

	    if (input.files && input.files[0]) {
	      var reader = new FileReader();
        reader.onloadend = function () {
          $(".loading-screen").hide();
        }
        reader.onload = function (e) {
          // l'image est chargée
          blockContent = e.target.result;
          var b = addBlock(CURRENT_SLIDE, "image", blockContent, $("#picture-form .jqte_editor").html(), fondLegende); // Ajout du bloc
          // MAJ de l'affichage et des données de position/taille du nv bloc
      	  majAffichage();
          majSize($("#block-" + b.id));
          majPos($("#block-" + b.id));
      	  closePopup();// Fermeture de la popup
        }

	        reader.readAsDataURL(input.files[0]);
	    }
  	});


  	// Sécurité sur la sélection d'un fichier image pour l'ajout d'un fond d'écran sur la slide actuelle.
  	$("#background-file").on('change', function() {
		var filePath = $(this).val();
		var isPicture = filePath.includes('.png') || filePath.includes('.jpg') || filePath.includes('.jpeg') || filePath.includes('.bmp') || filePath.includes('.gif');

		if ((filePath == null) && (filePath == '') || (isPicture == false)) {
			$(".uploadButton").removeClass('green');
			$(".uploadButton").addClass('red');
			$(".valid").attr('disabled', 'disabled');
			$("#background-popup .error").html('Le format de l\'image doit être png, jpg, jpeg, bmp ou gif.');
			$("#background-popup .error").slideDown(350);
		} else {
			$(".uploadButton").removeClass('red');
			$(".uploadButton").addClass('green');
			$("#background-popup .error").slideUp(350);
			$(".valid").removeAttr('disabled')
		}
	});


  	// Gestion de la sélection d'un fichier image pour le fond d'écran de la slide actuelle
  	$("#valid-background").on('click', function(e) {
      $(".loading-screen").show();
	    var error = $("#background-popup .error");
	    var input = $("#background-file")[0];

	    if (input.files && input.files[0]) {
	      var reader = new FileReader();
          reader.onloadend = function () {
            $(".loading-screen").hide();
          }
	        reader.onload = function (e) {
	            // l'image est chargée
	            var bg = e.target.result;
	            CURRENT_SLIDE.background = bg;
	            changeCurrentBackground (bg);

	            // MAJ de l'affichage et des données de position/taille du nv bloc
	        	majAffichage();
	        	closePopup();// Fermeture de la popup
	        }
	        reader.readAsDataURL(input.files[0]);
	    } else {
	      // l'image n'est pas bonne, on affiche l'erreur
	      error.html("Erreur dans l'ajout de l'image.");
	      error.slideDown(350);
	    }
  	});


  	// Gestion de la séléction d'un fichier image lors de l'édition d'un BlockPicture.
  	$("#valid-picture-edit").on('click', function(e) {
	    var block = pres.getBlockById($("#idbloc").val());

	    var colLeg = $("#bg-descPicture-selector-edit").val();
	    var fondLegende = (colLeg == "noir") ? true : false;
	    block.colorLegend = fondLegende;

	    // maj de la légende
	    var legende = $("#picture-form-edit .jqte_editor").html();
	    block.desc = legende; // MAJ du bloc

	    // maj de l'image
	    var input = $("#picture-file-edit")[0];
	    if (input.files && input.files[0]) {
        $(".loading-screen").show();
	      var reader = new FileReader();
          reader.onloadend = function () {
            $(".loading-screen").hide();
          }
	        reader.onload = function (e) {
            // l'image est chargée
            block.content = e.target.result; // maj du bloc
            var calculSize = BlockPicture.getImageSize(e.target.result);
            block.width = calculSize["width"];
            block.height = calculSize["height"];
            // MAJ de l'affichage et des données de position/taille du nv bloc
	        	majAffichage();
	        	closePopup();// Fermeture de la popup
	        }
	        reader.readAsDataURL(input.files[0]);
	    } else {

	    }

	    majAffichage(); // MAJ de l'affichage

	    $("#idbloc").remove(); // Fermeture de la popup
	    closePopup();
  	});


	// Sécurité sur la sélection d'un fichier video pour l'ajout d'un BlockVideo.
	$("#video-file").on('change', function() {
		var filePath = $(this).val();
		var isVideo = filePath.includes('.mp4') || filePath.includes('.webm');

		if ((filePath == null) && (filePath == '') || (isVideo == false)) {
			$(".uploadButton").removeClass('green');
			$(".uploadButton").addClass('red');
			$(".valid").attr('disabled', 'disabled');
			$("#video-popup .error").html('Le format de l\'image doit être mp4 ou webm.');
			$("#video-popup .error").slideDown(350);
		} else {
			$(".uploadButton").removeClass('red');
			$(".uploadButton").addClass('green');
			$("#video-popup .error").slideUp(350);
			$(".valid").removeAttr('disabled')
		}
	});


  	// Gestion de la séléction d'un fichier image lors de la création d'un BlockVideo.
	$("#valid-video").on('click', function(e) {
      $(".loading-screen").show();
	    var error = $("#video-popup .error");
	    var input = $("#video-file")[0];

	    if (input.files && input.files[0]) {
	      var reader = new FileReader();
          reader.onloadend = function () {
            $(".loading-screen").hide();
          }
	        reader.onload = function (e) {
	            // l'image est chargée
	            blockContent = e.target.result;
	            var b = addBlock(CURRENT_SLIDE, "video", blockContent, $("#picture-form .jqte_editor").html()); // Ajout du bloc
	            // MAJ de l'affichage et des données de position/taille du nv bloc
	        	majAffichage();
	            majSize($("#block-" + b.id));
	            majPos($("#block-" + b.id));
	        	closePopup();// Fermeture de la popup
	        }
	        reader.readAsDataURL(input.files[0]);
	    } else {
	      // l'image n'est pas bonne, on affiche l'erreur
	      error.html("Erreur dans l'ajout de la vidéo.");
	      error.slideDown(350);
	    }
	});


	// Gestion de l'ouverture d'une sauvegarde au format json.
	$(".load-file").on('change',function(e){
		var input = e.target;
		var isJson = $(this).val().includes('.json');

	    if (!input.files) {
	    	$("#open-error").html('Aucun fichier détecté');
	    	$("#white-shade").show();
	    	$("#open-error").slideDown(350);
	    } else if (!isJson) {
	    	$("#open-error").html('Le fichier doit être au format json');
	    	$("#white-shade").show();
	    	$("#open-error").slideDown(350);
	    } else {
        $(".loading-screen").show();
	      var reader = new FileReader();
        reader.onloadend = function () {
          $(".loading-screen").hide();
        }
	        reader.onload = function (e) {
	            var jsonFile = e.target.result;

	            var test = jsonToClass(jsonFile);

							pres=test;
							updateSlideList();
	            $("#title").text(test.titre);
	            listenersARefresh();
	        }
	        reader.readAsText(input.files[0]);
	    }
	});

});



///////////////////////
// Partie draggable/resizable
///////////////////////

$(function() {
  BLOCK_SELECTIONNE = null;


  $(document).on("click", function() {
    $(BLOCK_SELECTIONNE).removeClass("selection");
    BLOCK_SELECTIONNE = null;
  })
});

/* -------------------------------------- FIN GESTION DES LISTENERS, ETC. -------------------------------------- */
