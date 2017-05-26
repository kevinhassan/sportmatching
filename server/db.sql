create table attendre
(
	nbr_personne integer default 1 not null,
	date timestamp with time zone not null,
	distance_max integer not null,
	localisation geometry(Point,4326) not null,
	sport_id integer not null
		constraint attendre_sport_id_fkey
			references sport
				on update cascade on delete cascade,
	utilisateur_id integer not null
		constraint attendre_utilisateur_id_fkey
			references utilisateur
				on update cascade on delete cascade,
	constraint attendre_pkey
		primary key (sport_id, utilisateur_id)
);
create table notification
(
	id serial not null
		constraint notification_pkey
			primary key,
	contenu varchar(255) not null,
	utilisateur_id integer
		constraint notification_utilisateur_id_fkey
			references utilisateur
				on update cascade on delete cascade,
	partie_id integer
		constraint notification_partie_id_fkey
			references partie
				on update cascade on delete cascade
);
create table partie
(
	id serial not null
		constraint partie_pkey
			primary key,
	nbr_participant integer not null,
	heure_prise timestamp with time zone not null,
	heure_rendu timestamp with time zone not null,
	terrain_id integer
		constraint partie_terrain_id_fkey
			references terrain
				on update cascade on delete cascade,
	utilisateur_id integer
		constraint partie_utilisateur_id_fkey
			references utilisateur
				on update cascade on delete cascade
);
create table sport
(
	id serial not null
		constraint sport_pkey
			primary key,
	nom varchar(255) not null,
	nbr_max_participant integer not null
);
create table terrain
(
	id serial not null
		constraint terrain_pkey
			primary key,
	localisation geometry(Point,4326) not null
		constraint terrain_localisation_key
			unique,
	nom varchar(255),
	sport_id integer
		constraint terrain_sport_id_fkey
			references sport
				on update cascade on delete cascade,
	ville_id integer
		constraint terrain_ville_id_fkey
			references ville
				on update cascade on delete cascade
);
create table utilisateur
(
	id serial not null
		constraint utilisateur_pkey
			primary key,
	nom varchar(255) not null,
	prenom varchar(255) not null,
	mail varchar(255) not null
		constraint utilisateur_mail_key
			unique,
	mdp varchar(255) not null,
	est_admin boolean default false not null
);
create table ville
(
	id serial not null
		constraint ville_pkey
			primary key,
	nom varchar(255) not null
);
