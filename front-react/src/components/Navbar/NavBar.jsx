// Link et NavLink viennent de React Router.
//
// Link permet de naviguer vers une autre route sans recharger toute la page.
//
// NavLink fait la même chose, mais permet en plus de savoir
// si le lien correspond à la page actuellement affichée.
// C'est utile ici pour mettre visuellement en évidence
// la page active dans la sidebar.
import { Link, NavLink } from "react-router-dom";

// useState permet de stocker une donnée dans l'état du composant.
//
// useEffect permet d'exécuter du code à certains moments
// du cycle de vie du composant, ici pour récupérer le bénévole
// lorsque la Navbar est affichée.
import { useEffect, useState } from "react";

// Import du fichier CSS spécifique à la Navbar et à la sidebar.
import "./Navbar.css";


// Composant principal de navigation.
//
// "export default" permet d'importer ensuite ce composant
// dans App.jsx avec :
// import NavBar from "./components/Navbar/NavBar.jsx";
export default function NavBar() {

  // State qui va contenir les informations du bénévole connecté.
  //
  // Au départ la valeur est null car nous ne connaissons pas encore
  // le prénom et le nom du bénévole.
  const [benevole, setBenevole] = useState(null);


  // Lors de l'identification du bénévole, son identifiant a été
  // enregistré dans le localStorage du navigateur.
  //
  // localStorage.getItem() renvoie une chaîne de caractères.
  // Number() permet donc de convertir cette valeur en nombre.
  const benevoleId = Number(localStorage.getItem("benevoleId"));


  // isNaN signifie "is Not a Number".
  //
  // On vérifie ici que benevoleId est bien un nombre.
  //
  // Si benevoleId est un nombre :
  // isNaN(benevoleId)       -> false
  // !isNaN(benevoleId)      -> true
  //
  // isConnected vaut donc true lorsque nous avons un identifiant valide.
  const isConnected = !isNaN(benevoleId);


  // useEffect permet ici de récupérer les informations
  // du bénévole depuis notre API.
  useEffect(() => {

    // Si aucun bénévole n'est identifié,
    // on arrête immédiatement l'exécution du useEffect.
    if (!isConnected) return;


    // Requête HTTP GET vers l'API Express.
    //
    // Cette route retourne la liste des bénévoles.
    fetch("http://localhost:3000/api/benevoles")

      // fetch retourne une Response.
      //
      // res.json() transforme la réponse JSON
      // en données JavaScript utilisables.
      .then((res) => res.json())

      // data contient maintenant le tableau des bénévoles
      // récupéré depuis le backend.
      .then((data) => {

        // find() parcourt le tableau des bénévoles.
        //
        // On cherche celui dont l'id correspond à l'id
        // enregistré dans le localStorage.
        //
        // Exemple :
        // benevoleId = 3
        //
        // find cherche donc :
        // b.id === 3
        const benevoleConnecte =
          data.find((b) => b.id === benevoleId) || null;


        // Une fois le bénévole trouvé,
        // on enregistre ses informations dans le state.
        //
        // Cela provoque automatiquement un nouveau rendu
        // du composant avec son prénom, son nom et ses initiales.
        setBenevole(benevoleConnecte);
      })


      // Si la requête échoue, on remet benevole à null
      // afin d'éviter d'afficher des informations incorrectes.
      .catch(() => setBenevole(null));


  // Le useEffect est exécuté lorsque l'une de ces valeurs change.
  //
  // Ici :
  // - benevoleId
  // - isConnected
  //
  // React surveille donc ces deux valeurs.
  }, [benevoleId, isConnected]);


  // Début du rendu JSX du composant.
  return (

    // Fragment React.
    //
    // <>...</> permet de retourner plusieurs éléments
    // sans ajouter une div HTML supplémentaire.
    <>
      
      {/* ========================= */}
      {/* SIDEBAR                   */}
      {/* ========================= */}

      <aside className="app-sidebar">

        {/* Logo et identité visuelle de La Remise */}
        <div className="sidebar-logo">

          {/* Logo simplifié avec la lettre R */}
          <div className="sidebar-logo-icon">
            R
          </div>

          <div>
            <p className="sidebar-logo-title">
              LA REMISE
            </p>

            <p className="sidebar-logo-subtitle">
              UN MONDE PLUS DURABLE
            </p>
          </div>

        </div>


        {/* ========================= */}
        {/* NAVIGATION                */}
        {/* ========================= */}

        <nav className="sidebar-navigation">


          {/* NavLink permet de naviguer vers /dashboard.
              
              Contrairement à Link, NavLink nous donne accès
              à la propriété isActive.

              isActive vaut true lorsque l'utilisateur
              se trouve actuellement sur cette route. */}
          <NavLink
            to="/dashboard"

            // className peut recevoir une fonction avec NavLink.
            //
            // Si le lien est actif :
            // "sidebar-link sidebar-link-active"
            //
            // Sinon :
            // "sidebar-link"
            //
            // Cela permet au CSS de mettre en évidence
            // la page actuellement consultée.
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "sidebar-link-active" : ""
              }`
            }
          >
            <span className="sidebar-link-icon">
              ⌂
            </span>

            <span>
              Tableau de bord
            </span>
          </NavLink>


          {/* Navigation vers la liste des objets */}
          <NavLink
            to="/liste"

            // Même principe :
            // on ajoute automatiquement une classe CSS
            // lorsque la route /liste est active.
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "sidebar-link-active" : ""
              }`
            }
          >
            <span className="sidebar-link-icon">
              ▣
            </span>

            <span>
              Objets
            </span>
          </NavLink>


          {/* Navigation vers le formulaire permettant
              d'enregistrer un nouveau dépôt */}
          <NavLink
            to="/depots/nouveau"

            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "sidebar-link-active" : ""
              }`
            }
          >
            <span className="sidebar-link-icon">
              ＋
            </span>

            <span>
              Nouveau dépôt
            </span>
          </NavLink>

        </nav>


        {/* ========================= */}
        {/* SLOGAN                    */}
        {/* ========================= */}

        {/* Bloc situé en bas de la sidebar */}
        <div className="sidebar-slogan">

          <span className="sidebar-slogan-icon">
            ♻
          </span>

          <div>
            <strong>
              Moins de déchets,
            </strong>

            <span>
              plus d'histoires.
            </span>
          </div>

        </div>

      </aside>


      {/* ========================= */}
      {/* NAVBAR DU HAUT            */}
      {/* ========================= */}

      <header className="app-navbar">


        {/* ========================= */}
        {/* UTILISATEUR CONNECTÉ      */}
        {/* ========================= */}

        <div className="navbar-user">


          {/* Avatar contenant les initiales du bénévole */}
          <div className="navbar-avatar">

            {benevole

              // Si le bénévole existe,
              // on récupère la première lettre du prénom
              // et la première lettre du nom.
              //
              // Exemple :
              // prénom = "Sylvain"
              // nom = "Riso"
              //
              // résultat = "SR"
              ? `${benevole.prenom?.charAt(0) || ""}${
                  benevole.nom?.charAt(0) || ""
                }`

              // Si aucun bénévole n'est disponible,
              // on affiche simplement un point d'interrogation.
              : "?"}

          </div>


          {/* Nom et rôle du bénévole */}
          <div className="navbar-user-info">

            <strong>

              {isConnected && benevole

                // Si nous avons un identifiant valide
                // ET que le bénévole a été trouvé dans l'API,
                // on affiche son prénom et son nom.
                ? `${benevole.prenom} ${benevole.nom}`

                // Sinon on indique qu'aucun bénévole
                // n'est actuellement connecté.
                : "Non connecté"}

            </strong>

            {/* Pour le moment le rôle affiché est fixe */}
            <span>
              Bénévole
            </span>

          </div>


          {/* ========================= */}
          {/* DÉCONNEXION               */}
          {/* ========================= */}

          {/* Link permet ici de retourner vers la route "/",
              c'est-à-dire l'écran QuiEsTu.

              Comme il s'agit de React Router, la navigation
              se fait sans rechargement complet de la page. */}
          <Link
            to="/"
            className="navbar-logout"
          >
            Déconnexion
          </Link>

        </div>

      </header>

    </>
  );
}