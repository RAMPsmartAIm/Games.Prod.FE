import './Score.css';

function Score(props) {
    
    return(
        <div>
            
            {props.score.length >= 1 && (
                <div className={`single_score_container first_score first_score_mobile ${props.active === 0 ? 'focused' : ''}`}>
                    {props.score[0]}
                </div>
            )}
            {/* {props.score.length >= 1 && (
                <div className='small_circle first_small_circle'>
                    1
                </div>
            )} */}

            {props.score.length >= 2 && (
                <div className={`single_score_container second_score second_score_mobile ${props.active === 1 ? 'focused' : ''}`}>
                    {props.score[1]}
                </div>
            )}
            {/* {props.score.length >= 2 && (
                <div className='small_circle second_small_circle'>
                    2
                </div>
            )} */}

            {props.score.length >= 3 && (
                <div className={`single_score_container third_score third_score_mobile ${props.active === 2 ? 'focused' : ''}`}>
                    {props.score[2]}
                </div>
            )}
            {/* {props.score.length >= 3 && (
                <div className='small_circle third_small_circle'>
                    3
                </div>
            )} */}

            {props.score.length >= 4 && (
                <div className={`single_score_container fourth_score fourth_score_mobile ${props.active === 3 ? 'focused' : ''}`}>
                    {props.score[3]}
                </div>
            )}
            {/* {props.score.length >= 4 && (
                <div className='small_circle fourth_small_circle'>
                    4
                </div>
            )} */}

        
        </div>
    );

}

export default Score;