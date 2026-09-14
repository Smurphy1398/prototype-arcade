/** Original arrangements. Classic retains the owner's favored original tune. */
export const SCORES={
 barnyard:{bpm:145,beat:4,roots:[43,48,50,43,48,52,50,43],lead:[79,81,83,86,83,81,79,-1,76,79,81,84,83,79,76,74,79,83,86,88,86,83,81,79],wave:'triangle',bass:'triangle',steps:[0,2,4,6],duration:.10},
 rally:{bpm:162,beat:4,roots:[40,40,43,45,47,45,43,38],lead:[76,76,-1,79,83,81,79,76,74,-1,76,79,81,83,86,83,81,79,76,-1,79,81,83,76],wave:'sawtooth',bass:'triangle',steps:[0,2,3,6],duration:.09},
 dc:{bpm:144,beat:4,roots:[46,53,50,55,46,51,53,46],lead:[82,77,82,86,89,-1,86,82,84,79,84,87,91,87,84,-1,86,89,93,89,86,82,81,77],wave:'triangle',bass:'sine',steps:[0,2,4,7],duration:.16},
 nyc:{bpm:148,beat:4,roots:[43,50,48,46,43,53,50,48],lead:[79,-1,77,74,79,82,86,-1,84,82,77,-1,79,74,72,74,77,81,84,81,79,-1,77,74],wave:'triangle',bass:'triangle',steps:[0,2,3,6],duration:.11},
 vegas:{bpm:124,beat:4,roots:[45,52,48,55,45,53,50,52],lead:[81,85,88,-1,85,81,80,-1,83,86,90,86,85,-1,81,80,81,-1,88,92,90,88,85,81],wave:'sine',bass:'sine',steps:[0,3,4,7],duration:.19},
 candy:{bpm:152,beat:3,roots:[48,55,53,57,48,53,55,48],lead:[84,88,91,88,86,84,81,84,89,86,84,81,79,83,86,91,88,84,86,89,93,89,88,84],wave:'triangle',bass:'sine',steps:[0,2,4],duration:.12},
 atlantis:{bpm:108,beat:4,roots:[38,45,41,48,38,43,46,45],lead:[74,-1,81,77,76,-1,72,-1,74,77,81,84,81,-1,77,74,72,76,79,-1,81,77,74,-1],wave:'sine',bass:'sine',steps:[0,4,6],duration:.42},
 toybox:{bpm:136,beat:4,roots:[48,52,53,55,57,53,50,55],lead:[84,79,76,79,86,81,77,81,88,84,79,84,89,86,81,-1,88,84,81,79,77,81,86,84],wave:'triangle',bass:'triangle',steps:[0,2,4,7],duration:.15},
 glacier:{bpm:132,beat:4,roots:[50,57,55,52,50,59,57,54],lead:[86,81,78,-1,81,85,90,-1,88,83,79,76,79,83,88,-1,86,90,93,90,86,81,78,-1,85,88,92,88,85,81,78,-1],wave:'sine',bass:'triangle',steps:[0,3,4,6],duration:.25},
 vietnam:{bpm:138,beat:4,roots:[40,43,45,40,47,45,43,38],lead:[64,-1,67,69,71,-1,67,64,62,64,-1,67,69,67,64,-1,71,74,71,69,67,-1,64,62,67,69,71,-1,69,67,64,-1],wave:'triangle',bass:'triangle',steps:[0,3,4,6],duration:.14},
 volcano:{bpm:156,beat:4,roots:[38,38,41,45,38,43,41,37],lead:[62,65,69,-1,74,69,65,62,61,65,68,-1,73,68,65,61,62,-1,69,74,77,74,69,65,67,70,74,77,74,70,67,-1],wave:'triangle',bass:'sine',steps:[0,2,4,7],duration:.12},
 'sunspun-tour':{bpm:142,beat:4,roots:[48,53,45,55,48,50,53,55],lead:[79,76,72,-1,74,76,81,79,77,81,84,81,79,-1,76,74,76,-1,81,84,83,79,76,72,74,79,81,83,86,83,79,-1],wave:'triangle',bass:'sine',steps:[0,2,3,6],duration:.13},
 moonbell:{bpm:126,beat:3,roots:[50,57,46,53,50,55,57,50],lead:[74,-1,77,81,77,-1,73,-1,76,81,79,76,74,77,82,-1,81,77,72,76,79,-1,77,76],wave:'sine',bass:'triangle',steps:[0,3],duration:.32},
 factory:{bpm:150,beat:4,roots:[40,40,43,45,40,47,45,43],lead:[64,67,-1,64,71,67,-1,62,64,-1,67,69,-1,67,64,62,67,71,74,-1,71,69,67,-1,69,72,76,72,71,67,64,-1],wave:'square',bass:'sawtooth',steps:[0,3,4,7],duration:.07},
 orbital:{bpm:116,beat:4,roots:[45,53,48,55,45,50,53,52],lead:[81,-1,88,84,-1,83,79,-1,77,81,-1,84,88,-1,86,84,79,-1,83,86,-1,84,81,79,83,86,90,-1,88,86,83,-1],wave:'sine',bass:'sine',steps:[0,4],duration:.4},
 victory:{bpm:144,beat:4,roots:[48,53,55,48],lead:[79,84,88,-1,86,84,81,79,81,84,89,88,86,84,81,-1,83,86,91,89,88,86,83,79,84,88,91,88,84,-1,-1,-1],wave:'triangle',bass:'triangle',steps:[0,2,4,6],duration:.19},
 finish:{bpm:120,beat:4,roots:[48,45,53,55],lead:[76,79,81,-1,79,76,74,-1,72,76,81,79,76,-1,74,72,77,81,84,-1,81,79,77,-1,74,79,83,81,79,-1,76,74],wave:'sine',bass:'triangle',steps:[0,4],duration:.25},
} as const;
export type SongId='classic'|keyof typeof SCORES;
