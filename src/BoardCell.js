import React, {useState} from 'react';


function BoardCell(props){

  function onClickColum(i){
    props.onClick(i)
  }

  return(
    <div className='gameContainer'>
       {props.cell.map((cell, i) =>(    
          <div key={i} style={{backgroundColor: cell}} className={"cell " + (cell === null ? null : "dropped")} onClick={()=>onClickColum(i)}></div>
       ))}
    </div>
  )
}

export default BoardCell;
