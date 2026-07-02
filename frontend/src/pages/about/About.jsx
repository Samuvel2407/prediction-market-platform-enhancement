import React from 'react';

function About() {
  return (
    <div className='flex flex-col h-full text-white p-4 md:p-6 lg:p-8'>
      <h1 className='text-2xl md:text-3xl font-bold mb-4 text-blue-400'>
        Prediction Market Platform Enhancement
      </h1>
      <div className='bg-gray-800 rounded-lg shadow-lg flex-grow overflow-auto'>
        <div className='p-4 md:p-6 space-y-6 md:space-y-8'>
          
          <div className='text-center border-b border-gray-700 pb-4'>
            <p className='text-sm text-gray-300 font-medium'>
              Developed & Enhanced by
            </p>
            <p className='text-lg font-bold text-white'>
              Samuvel Joseph J
            </p>
            <p className='text-xs text-center mt-1'>
              <a
                href='https://github.com/Samuvel2407'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-400 hover:text-blue-300'
              >
                ⭐ Samuvel2407 on GitHub
              </a>
            </p>
          </div>

          <section className='space-y-3'>
            <h2 className='text-xl font-semibold text-blue-400'>
              What are Prediction Markets?
            </h2>
            <p className='text-gray-300 leading-relaxed'>
              Prediction markets are exchange-traded markets where individuals can trade contracts based on the outcome of future events. By assigning monetary or tokenized values to potential outcomes (e.g., YES or NO shares), market prices act as real-time, aggregated probability estimates of the event occurring.
            </p>
          </section>

          <section className='space-y-3'>
            <h2 className='text-xl font-semibold text-blue-400'>
              Why Collective Forecasting Matters
            </h2>
            <p className='text-gray-300 leading-relaxed'>
              Collective forecasting leverages the **Wisdom of the Crowd**. When individuals are incentivized to research and take stakes in their forecasts, it reduces biases and filters out noise. Empirical research shows that prediction markets consistently outperform expert panels, traditional polling, and individual forecasters by continuously aggregating diverse points of view.
            </p>
          </section>

          <section className='space-y-3'>
            <h2 className='text-xl font-semibold text-blue-400'>
              Technical Architecture Overview
            </h2>
            <p className='text-gray-300 leading-relaxed'>
              The **Prediction Market Platform Enhancement** is built upon a high-performance decoupled architecture:
            </p>
            <ul className='list-disc list-inside text-gray-300 pl-4 space-y-1'>
              <li>
                <strong className='text-white'>Frontend:</strong> React Single Page Application (SPA) built with Vite and TailwindCSS for responsive user experiences and smooth interactions.
              </li>
              <li>
                <strong className='text-white'>Backend:</strong> High-concurrency RESTful Go (Golang) server powered by Gorilla Mux routing and GORM persistence.
              </li>
              <li>
                <strong className='text-white'>Database:</strong> SQLite database for flexible local development and GORM integrations.
              </li>
              <li>
                <strong className='text-white'>Authentication:</strong> Stateless JWT authentication protecting state change endpoints and password reset gates.
              </li>
              <li>
                <strong className='text-white'>Market Economics:</strong> Automated market maker (AMM) utilizing the Logarithmic Market Scoring Rule (LMSR) to guarantee liquidity and price adjustment dynamics.
              </li>
            </ul>
          </section>

          <section className='space-y-3'>
            <h3 className='text-lg font-semibold text-blue-400'>
              Project Attribution & Enhancements
            </h3>
            <p className='text-gray-300 leading-relaxed'>
              This project is built on top of the open-source{' '}
              <a
                href="https://github.com/openpredictionmarkets/socialpredict"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                SocialPredict
              </a>{' '}
              platform. It has been enhanced as an engineering case study and product analysis project. Key upgrades include resolver URL bugfixes, dev proxy configuration mappings, user portal fallbacks, and UI modernization.
            </p>
          </section>

          <p className='text-base font-bold text-center text-blue-300 my-4'>
            Empowering communities to make data-driven predictions and collective discoveries.
          </p>

        </div>
      </div>
    </div>
  );
}

export default About;
