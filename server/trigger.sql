CREATE OR REPLACE FUNCTION check_partie_nbr() RETURNS TRIGGER AS
$BODY$
  DECLARE
    nb_max INTEGER;
    idSport INTEGER;
    personne INTEGER;
  BEGIN
    --récupérer le nombre maximum de joueur pour le sport concerné
    nb_max =(SELECT nbr_max_participant from terrain INNER JOIN sport ON terrain.sport_id = sport.id WHERE new.terrain_id = terrain.id);
    idSport=(SELECT sport.id from sport,terrain WHERE terrain.id=NEW.terrain_id and terrain.sport_id=sport.id);

    IF (new.nbr_participant<nb_max) THEN--Cas ou il reste de la place pour d'autre joueur
      --Regarder tous les joueurs en attente à proximité du terrain
      --Récupérer le nombre de joueur en attente (seulement s'ils sont inférieurs au nombre maximum du sport)

      --TODO: Verifier que l'utilisateur en attente attend peu de temps (comparaison de durée)
      FOR personne IN SELECT utilisateur_id FROM attendre,terrain WHERE attendre.sport_id=idSport AND new.nbr_participant+attendre.nbr_personne <= nb_max
      AND NEW.terrain_id = terrain.id AND (SELECT ST_Distance(
            ST_Transform(attendre.localisation,26986),
            ST_Transform(terrain.localisation,26986)
          ))/1000<=attendre.distance_max
      LOOP
        --Ajouter une notification à l'utilisateur concerné
        INSERT INTO notification(contenu,utilisateur_id,partie_id) VALUES('Partie disponible à proximité',personne,NEW.id);

      END LOOP;
    END IF;
    RETURN NEW;
	END;
$BODY$
LANGUAGE plpgsql;
