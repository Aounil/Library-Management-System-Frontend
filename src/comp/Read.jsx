import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import './read.css'


export default function Read(props) {
    const location = useLocation()
    const { img, name, author, description } = location.state;




    return (
        <div>


            <div className='container' >
                <div className='row'>

                    <div className='col d-flex justify-content-center'>
                        <img className='pic-read' src={img} />
                    </div>
                    <div className='col-4 m-5 align-content-center'>
                        <div>
                            <h2>{name}</h2>
                            <p>By : {author}</p>
                            <p><strong>description : </strong>{description}</p>
                        </div>
                    </div>


                </div>


            </div>




        </div>
    )
}
