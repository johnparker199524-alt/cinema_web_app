//	Ricalca	1:1	FilmSummaryDTO	(Java)
export	interface	FilmSummary	{
id:	number;
titolo:	string;
immagineUrl:	string;
genere:	string;
}
//	Ricalca	1:1	FilmDetailDTO	(Java),	con	l'AGGIUNTA	di	trailerUrl	—
//	campo	che	non	esisteva	lato	Java/Firebase	(niente	video	nel	dataset
//	demo)	ma	che	TMDB	fornisce	nativamente:	url	di	embed	YouTube	del
//	trailer	ufficiale,	o	null	se	il	film	non	ne	ha	uno	disponibile.
export	interface	FilmDetail	{
id:	number;
titolo:	string;
immagineUrl:	string;
genere:	string;
descrizione:	string;
distributore:	string;
anno:	number;
dataUscita:	string;
regista:	string;
trailerUrl:	string	|	null;
}
//	Ricalca	1:1	FilmCalendarioDTO	(Java)	—	usato	dal	Calendario	Uscite
export	interface	FilmCalendario	{
id:	number;
titolo:	string;
immagineUrl:	string;
genere:	string;
anno:	number;
dataUscita:	string;
regista:	string;
distributore:	string;
}
//	Ricalca	1:1	NewsDTO	(Java)
export	interface	NewsArticle	{
id:	number;
titolo:	string;
immagineUrl:	string;
sommario:	string;
contenuto:	string;
dataPubblicazione:	string;
}
//	Ricalca	1:1	ErrorResponseDTO	(Java)	—	nota	"message",	non	"messaggio"
export	interface	ApiError	{
timestamp:	string;
status:	number;
error:	string;
message:	string;
path:	string;
}
//	10	valori,	uguali	uno	a	uno	all'enum	Genere	lato	Java
export	type	Genere	=
|	"DRAMMATICO"	|	"COMMEDIA"	|	"THRILLER"	|	"AZIONE"	|	"ANIMAZIONE"
|	"FANTASCIENZA"	|	"AVVENTURA"	|	"SENTIMENTALE"	|	"HORROR"	|	"DOCUMENTARIO";
//	5	valori,	uguali	uno	a	uno	all'enum	PeriodoUscita	lato	Java:
//	mandare	una	stringa	fuori	da	questo	elenco	è	un	errore	di	COMPILAZIONE,
//	non	un	bug	scoperto	cliccando	sul	dropdown	a	runtime.
export	type	PeriodoUscita	=
|	"SCORSA_SETTIMANA"	|	"QUESTA_SETTIMANA"	|	"TRA_1_SETTIMANA"
|	"TRA_2_SETTIMANE"	|	"TRA_3_SETTIMANE";
//	Le	label	italiane	da	mostrare	nei	5	bottoni,	nello	stesso	ordine	della	slide
export	const	PERIODO_LABELS:	Record<PeriodoUscita,	string>	=	{
SCORSA_SETTIMANA:	"Scorsa	settimana",
QUESTA_SETTIMANA:	"Questa	settimana",
TRA_1_SETTIMANA:		"Tra	1	settimana",
TRA_2_SETTIMANE:		"Tra	2	settimane",
TRA_3_SETTIMANE:		"Tra	3	settimane",
};
export	const	PERIODO_ORDINE:	PeriodoUscita[]	=	[
"SCORSA_SETTIMANA",	"QUESTA_SETTIMANA",	"TRA_1_SETTIMANA",
"TRA_2_SETTIMANE",	"TRA_3_SETTIMANE",
];
export	type	RequestStatus	=	"idle"	|	"loading"	|	"succeeded"	|	"failed"