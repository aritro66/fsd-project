const cartdata = document.getElementsByClassName('delete');
const cartdatadesc = document.getElementsByClassName('desc');
const cartdatainc = document.getElementsByClassName('inc');

if (cartdata) {
  for (let i = 0; i < cartdata.length; i++) {
    cartdata[i].addEventListener('click', async (e) => {
      console.log(e.target);
      console.log(e.target.getAttribute("iddata"));
      const rawResponse = await fetch('http://localhost:4000/deletecart', {
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
if (cartdatadesc) {
  for (let i = 0; i < cartdatadesc.length; i++) {
    cartdatadesc[i].addEventListener('click', async (e) => {
      console.log(e.target);
      console.log(e.target.getAttribute("iddata"));
      const rawResponse = await fetch('http://localhost:4000/descquantity', {
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
if (cartdatainc) {
  for (let i = 0; i < cartdatainc.length; i++) {
    cartdatainc[i].addEventListener('click', async (e) => {
      console.log(e.target);
      console.log(e.target.getAttribute("iddata"));
      const rawResponse = await fetch('http://localhost:4000/incquantity', {
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