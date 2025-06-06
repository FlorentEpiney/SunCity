import React from "react";

function SummaryProject(){
    //const navigate = useNavigate();
    return(
        <div>
            <aside>
                <div>
                    <h3>Summary of the project data</h3>
                    <p><strong>Development team:</strong></p>
                    <ul>
                        <li>
                            <p><strong>Fernandes Walter</strong>: Design & Gameplay</p>
                        </li>
                        <li>
                            <p><strong>Epiney Florent</strong>: JavaScript Specialist</p>
                        </li>
                        <li>
                            <p><strong>Meichtry Micha</strong>: Style CSS Specialist </p>
                        </li>
                        <li>
                            <p><strong>Cortés Julio</strong>: Game Architect</p>
                        </li>
                    </ul>
                </div>
            </aside>
            <footer>
                <img id="logo" src="/resources/images/logo.png" alt="Logo"/>
            </footer>
        </div>
    );
}

export default SummaryProject;