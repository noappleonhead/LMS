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


      <div style={{ textAlign: 'center' }}>
        Icons made by{' '}
        <a href="http://www.freepik.com" title="Freepik">
          Freepik
        </a>{' '}
        from{' '}
        <a href="https://www.flaticon.com/" title="Flaticon">
          www.flaticon.com
        </a>{' '}
        is licensed by{' '}
        <a
          href="http://creativecommons.org/licenses/by/3.0/"
          title="Creative Commons BY 3.0"
        >
          CC 3.0 BY
        </a>
      </div>
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