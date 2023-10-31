import React from 'react'
import { Link ,useNavigate} from 'react-router-dom';

function Nav() {
  const auth = localStorage.getItem('user')
  const navigate = useNavigate();
  const logout =()=>{
    localStorage.clear();
    navigate('/signup')
  }
  return (
   <>
   <img 
   alt="logo"
   className='logo'
   src="https://img.freepik.com/premium-vector/abstract-modern-ecommerce-logo-design-colorful-gradient-shopping-bag-logo-template_467913-995.jpg"></img>
   { auth ?
    <ul className='nav-ul'>
        <li><Link to ="/">Product</Link></li>
        <li><Link to ="/add">Add Product</Link></li>
        <li><Link to ="/update">Update Product</Link></li>
        <li><Link to  ="/profile">Profile</Link></li>
        <li><Link onClick ={logout} to ="/signup">Logout({JSON.parse(auth).name})</Link></li>
    </ul>
        :
        <ul className='nav-ul nav-right'>
          <li><Link to  ="/signup">Sign Up</Link></li>
          <li><Link to  ="/login">Login</Link></li>
        </ul>
}
   </>
  )
}

export default Nav
