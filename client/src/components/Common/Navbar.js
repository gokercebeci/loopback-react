import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import logo from '../../styles/img/logo.svg';

const FILE_URL = process.env.REACT_APP_FILE_URL;

class Navbar extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            me: props.me,
            shrink: props.me ? true : false
        };
    }

    static dropDownToggle(e) {
        const dd = e.currentTarget;
        dd.classList.toggle('show');
        dd.querySelector('.dropdown-menu').classList.toggle('show');
    }

    static Shrink(e, shrink) {
        console.log('shrink', shrink)
        const navbar = document.getElementById('navbar');
        if (shrink || window.pageYOffset > 1) {
            navbar.classList.add("navbar-shrink");
        } else {
            navbar.classList.remove("navbar-shrink");
        }
    }

    componentDidMount() {
        Navbar.Shrink(null, this.state.shrink);
        if (!this.state.shrink)
            window.addEventListener('scroll', Navbar.Shrink);
    }

    componentWillReceiveProps(props) {
        console.log('navbar new props', props);
        this.setState({
            me: props.me,
            shrink: props.me ? true : false
        })
        Navbar.Shrink(null, props.me);
        if (props.me)
            window.removeEventListener('scroll', Navbar.Shrink);
        else
            window.addEventListener('scroll', Navbar.Shrink);
    }


    renderLogo() {
        if (this.state.me) {
            return [
                <Link to="/home" className="navbar-brand" key="logo">
                    <img src={logo} className="img-fluid" alt="logo"/>
                </Link>
            ];
        } else {
            return [
                <Link to="/" className="navbar-brand" key="logo">
                    <img src={logo} className="img-fluid" alt="logo"/>
                </Link>];
        }
    }

    renderLinks() {
        if (this.state.me) {
            return [
                <li className="nav-item" key="users">
                    <Link className="nav-link" to="/users">Users</Link>
                </li>
            ];
        } else {
            return [<li className="nav-item" key="features">
                <Link className="nav-link" to="/features">Features</Link>
            </li>];
        }
    }

    renderUserMenu() {
        if (this.state.me) {
            return [
                <li className="nav-item dropdown" key="userMenu" onClick={Navbar.dropDownToggle}>
          <span className="nav-link dropdown-toggle" data-toggle="dropdown">
              <img className="navbar-avatar"
                   onError={(e) => {
                       e.target.onerror = null;
                       e.target.src = "http://holder.ninja/50x50,P.svg"
                   }}
                   src={FILE_URL + this.state.me.image.thumb} alt={this.state.me.name}/>
            <i className={this.state.me.icon}></i> <strong>{this.state.me.name}</strong>
          </span>
                    <div className="dropdown-menu">
                        <Link className="dropdown-item" to="/profile">Profile</Link>
                        <Link className="dropdown-item" to="/settings">Settings</Link>
                        <div className="dropdown-divider"></div>
                        <Link className="dropdown-item" to="/signout">Log out</Link>
                    </div>
                </li>
            ];
        } else {
            return [
                <li className="nav-item" key="signin">
                    <Link className="nav-link" to="/signin">Sign In</Link>
                </li>,
                <li className="nav-item" key="signup">
                    <Link className="nav-link" to="/signup">Sign Up</Link>
                </li>
            ];
        }
    }

    render() {
        return (
            <nav id="navbar" className="navbar navbar-expand-lg navbar-light fixed-top">
                <div className="container">
                    {this.renderLogo()}
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarMain"
                            aria-controls="navbarMain" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarMain">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item" key="about">
                                <Link className="nav-link" to="/#about">About</Link>
                            </li>
                            {this.renderLinks()}
                        </ul>

                        <ul className="nav navbar-nav navbar-right">
                            {this.renderUserMenu()}
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

const mapStateToProps = (state) => {
    console.log('mapStateToProps', state.auth);
    return {me: state.auth.me}
}

export default connect(mapStateToProps)(Navbar);