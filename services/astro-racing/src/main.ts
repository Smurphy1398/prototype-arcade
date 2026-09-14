import './ui/room.css';

﻿import './ui/style.css';
import './ui/race.css';
import { Game } from './core/Game';
try { new Game(); } catch(error) { document.getElementById('ui')!.innerHTML='<section class="modal"><div class="pause-card"><h2>A small pit stop.</h2><p>A WebGL 2 desktop browser is needed. Reload to try again.</p></div></section>'; console.error(error); }

import './ui/garage.css';

import './ui/destinations.css';

import './ui/v05.css';

import './ui/mobile.css';
