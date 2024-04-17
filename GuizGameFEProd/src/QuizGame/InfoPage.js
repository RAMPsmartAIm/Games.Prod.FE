import React, {useState} from 'react';
import './InfoPage.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/Navbar';

function InfoPage() {
    const [input, changeInput] = useState(null);

    return(
        <div>
            <Navbar />
            <div>
                <h2 className='rules_title'>Rules</h2>
            </div>
            <div className='rules_info'>
                <p>
                    <b>The game</b> starts on a screen with a play button and the option to select the number of players (1-4). If more than one player is selected, they will take turns during the game. If only one player is selected, their opponent will be a bot (1v1). Finally, the player selects the game mode, which determines the desired number of points for the winner: Short (10 points), Medium (20 points), Long (30 points).
                </p>
                <p>
                    The game screen will feature the main question and 6 sub-questions derived from the main question, each of which can be interacted with in various ways:
                </p>
                <ol>
                    <li>The option to mark as <b>true or false based</b> on the main question.</li>
                    <li>Options will need to be <b>arranged</b> in order based on the main question.</li>
                    <li>The answer will be a <b>numerical range</b> from to.</li>
                    <li>The correct <b>text option</b> must be selected.</li>
                </ol>
                <p>
                    Players can skip a question or mark any number of options, with the selection of answers being limited by time.
                    After completing their turn, the program evaluates all questions. If any are incorrect, the player loses all points for that question and cannot continue with it; otherwise, they earn points based on the number of correct answers (1 point per correct answer).
                    The next player continues. The game continues until all players skip their turn or until all questions have been answered.
                    After each question, a scoreboard will display the points of each player. If no one reaches the winning point total, there will be a button to proceed to new game; otherwise, the score is final, and the user can return to the main screen
                </p>
            </div>
            <div className='info_page_button'><a href='/'><button className='custom_modal_button'>Back to home page</button></a></div>
        </div>
    );


}

export default InfoPage;
