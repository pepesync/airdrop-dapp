import React from "react";

function WalletList({list,connectWallet}) {
  // console.log(poolList);
    return(
        <div className='row'>
        {
        list
        ? list.map((item, idx) => {
            return (
                <div key={idx} className='col-3' 
                    onClick={() => {
                        connectWallet(item.provider);
                    }}>
                    <div className='card shadow-sm p-3 mb-5 rounded bg-transparent border-white' style={{backdropFilter: "blur(6px)"}}>
                        <div className="card-body">
                            <div className='text-center'>
                                <img className="icon-lg" src={process.env.PUBLIC_URL +'/'+item.icon} alt={item.name}/>
                                <h4 className="mt-2 title-text">{item.name}</h4>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}) :""
        }
      </div>
    );
}
export default WalletList;