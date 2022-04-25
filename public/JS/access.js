const blockAcc = document.getElementsByClassName('block');
const allowAcc = document.getElementsByClassName('unblock');


if (blockAcc) {
  for (let i = 0; i < blockAcc.length; i++) {
    blockAcc[i].addEventListener('click', async (e) => {
      console.log(e.target);
      console.log(e.target.getAttribute("iddata"));
      const rawResponse = await fetch('http://localhost:4000/block', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productid: e.target.getAttribute("iddata") })
      })
      window.location.reload();
    })
  }
}

if (allowAcc) {
    for (let i = 0; i < allowAcc.length; i++) {
      allowAcc[i].addEventListener('click', async (e) => {
        console.log(e.target);
        console.log(e.target.getAttribute("iddata"));
        const rawResponse = await fetch('http://localhost:4000/unblock', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ productid: e.target.getAttribute("iddata") })
        })
        window.location.reload();
      })
    }
  }