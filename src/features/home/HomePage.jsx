import React from 'react';

const HomePage = ({history}) => {
  return (
    <div>
      <header class="homepage">
            <div class="homepage__logo-box">
                <img src="/assets/logo-full-white.png" alt="logo" className="homepage__logo" />
            </div>

            <div class="homepage__text-box">
                <h1 class="heading-primary">
                    <span class="heading-primary--main">  JR Academy</span>
                    <span class="heading-primary--sub"> Learning Management System</span>
                </h1>

                <a href="#section-tours"onClick={() => history.push('/events')} 
                className="btn btn--white btn--animated">Discover your tours</a>
            </div>
      </header>

      <footer class="footer" style={{ textAlign: 'center' }}>
      <div class="row">

              <div class="footer__navigation">
                  <ul class="footer__list">
                      <li class="footer__item"><a href="#" class="footer__link">Company</a></li>
                      <li class="footer__item"><a href="#" class="footer__link">Contact us</a></li>
                      <li class="footer__item"><a href="#" class="footer__link">Carrers</a></li>
                      <li class="footer__item"><a href="#" class="footer__link">Privacy policy</a></li>
                      <li class="footer__item"><a href="#" class="footer__link">Terms</a></li>
                  </ul>
              </div>

              <p class="footer__copyright">
                  Built by <a href="#" class="footer__link">Rene Huang</a> for course <a href="#" class="footer__link">FULL STACK DEVELOPER course- JR Academy</a>.
                  Copyright &copy; by Rene Huang. 100% allowed to use this webpage for both personal
                  and commercial use, but NOT to claim it as your own design.
              </p>

      </div>
  </footer>

    </div>
  );
};

export default HomePage;

// <div className="ui inverted vertical masthead center aligned segment">
// <div className="ui text container">
// <h1 className="ui inverted stackable header">
//   <img
//     className="ui image massive"
//     src="/assets/logo.png"
//     alt="logo"
//   />
//   <div className="content">LMS</div>
// </h1>
// <h2>JR Academy Fullfill your dream</h2>
// <div onClick={() => history.push('/events')} className="ui huge white inverted button">
//   Get Started
//   <i className="right arrow icon" />
// </div>
// </div>
// </div>