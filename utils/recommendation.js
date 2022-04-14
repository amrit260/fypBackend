const ContentBasedRecommender = require('content-based-recommender');
const tourModel = require('../models/tourModel');
const bookingModel = require('../models/bookingModel');
const otherSiteTours = require('./scrapedData');

const recommendation = async (req, res, next) => {
  const recommender = new ContentBasedRecommender({
    minScore: 0.01,
    maxSimilarDocuments: 10
  });

  const getTopTour = async () => {
    let topTour = await tourModel.find({ ratingsAverage: { $gte: 4.7 } });

    topTour = topTour[topTour.length - 1].id;
    return topTour;
  };

  // getting datasets for training

  const dataset = await tourModel.find();
  const formattedDataset = dataset.map((tour, index) => {
    let newtour = {
      content: `${tour.difficulty} ${tour.summary} ${tour.category} ${
        tour.rating
      } ${tour.price}`,
      id: tour.id
    };

    // console.log(newtour);

    return newtour;
  });

  recommender.train(formattedDataset);

  let sampleTour;
  // previoustours booked by a user

  if (req.user) {
    // previous tour booked by user
    prevBooking = await bookingModel.find({ user: req.user.id });
    if (prevBooking.length > 0) {
      sampleTour = prevBooking[0].tour.id;
    } else {
      sampleTour = await getTopTour();
    }
  } else {
    sampleTour = await getTopTour();
  }

  //   console.log(sampleTour);

  let similarDocuments = recommender.getSimilarDocuments(sampleTour, 0, 5);
  similarDocuments = similarDocuments.sort((a, b) => {
    return b.score - a.score;
  });
  const result = await Promise.all(
    similarDocuments.map(t => {
      // console.log(t);

      return tourModel.findById(t.id);
    })
  );

  const getOffers = () => {
    const offers = [];
    dataset.forEach((tour, index) => {
      otherSiteTours.forEach(t => {
        if (tour.name === t.title && parseInt(tour.price) < parseInt(t.price)) {
          offers.push({ thirdPartyPrice: t.price, tour });
        }
      });
    });
    // console.log(offers);
    return offers;
  };

  res.status(200).json({
    status: 'success',
    length: result.length,
    similarTours: result,
    otherSiteTours: getOffers()
  });
};
module.exports = recommendation;
