const express = require('express');
const router = new express.Router();

const UserController = require('../controllers/user.controller');
const googleAuthController = require('../controllers/googleAuth.controller');
const facebookAuthController = require('../controllers/facebookAuth.controller');

// to create a user
router.post('/user', (req, res) => {
  UserController.registerUser(req)
    .then((resp) => {
      return res.status(resp.statusCode).send(resp.data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
    });
});

// to login a user
router.post('/user/login', (req, res) => {
  UserController.loginUser(req.body.email, req.body.password)
    .then((resp) => res.status(resp.statusCode).send(resp.data))
    .catch((err) => {
      console.error(err);
      res.status(500);
    });
});

router.post('/authWithGoogle', (req, res) => {
  googleAuthController
    .authenticate(req.body.token)
    .then((resp) => res.status(resp.statusCode).send(resp.data))
    .catch((err) => {
      console.error(err);
      res.status(500);
    });
});

router.post('/authWithFacebook', (req, res) => {

  facebookAuthController
     .authenticate(req.body.userID, req.body.token)
    .then((resp) => res.status(resp.statusCode).send(resp.data))
    .catch((err) => {
      console.error(err);
      console.log('The error that occured ==>\n', err);
      res.status(500);
    });
});

// to activate user account.
// the frontend calls this API wile passing the ActivationCode as parameters
router.get('/user/activate/:activationCode', (req, res) => {
  UserController.activateUserAccount(req, res)
    .then((resp) => res.status(resp.statusCode).send(resp.data))
    .catch((err) => {
      console.error(err);
      res.status(500);
    });
});

//==========================================================//
router.get('/subjects', (req, res) => {
  res.status(200).send([
    {
      name: 'all',
    },
    {
      name: 'mathematics',
    },
    {
      name: 'chemistry',
    },
    {
      name: 'history',
    },
    {
      name: 'english',
    },
    {
      name: 'biology',
    },
    {
      name: 'physics',
    },
    {
      name: 'social_studies',
    },
    {
      name: 'agriculture',
    },
    {
      name: 'arts',
    },
    {
      name: 'geography',
    },
    {
      name: 'business',
    },
    {
      name: 'computers',
    },
    {
      name: 'french',
    },
    {
      name: 'spanish',
    },
    {
      name: 'medicine',
    },
    {
      name: 'law',
    },
    {
      name: 'engineering',
    },
  ]);
});

router.get('/challenges', (req, res) => {
  res.status(200).send([
    {
      id: 1,
      name:
        'Answer 5 questions from any subject in 48 hours to collect 50 points',
      user_answer: 0,
      total_required_answer: 5,
      time_limit: [2, 0],
      time_remaining: '',
      subject_category: 'all',
    },
    {
      id: 2,
      name:
        'Answer 10 questions from any subject in 48 hours to collect 100 points',
      user_answer: 0,
      total_required_answer: 10,
      time_limit: [2, 0],
      time_remaining: '',
      subject_category: 'all',
    },
    {
      id: 3,
      name:
        'Answer 25 questions from any subject in 48 hours to collect 400 points',
      user_answer: 0,
      total_required_answer: 25,
      time_limit: [2, 0],
      time_remaining: '',
      subject_category: 'all',
    },
    {
      id: 4,
      name: 'Answer 5 English questions in 48 hours to collect 50 points',
      user_answer: 0,
      total_required_answer: 5,
      time_limit: [2, 0],
      time_remaining: '',
      subject_category: 'english',
    },
    {
      id: 5,
      name: 'Answer 10 English questions in 48 hours to collect 100 points',
      user_answer: 0,
      total_required_answer: 10,
      time_limit: [2, 0],
      time_remaining: '',
      subject_category: 'english',
    },
    {
      id: 6,
      name: 'Answer 25 English questions in 48 hours to collect 400 points',
      user_answer: 0,
      total_required_answer: 25,
      time_limit: [2, 0],
      time_remaining: '',
      subject_category: 'english',
    },
    {
      id: 7,
      name: 'Answer 5 Mathematics questions in 48 hours to collect 50 points',
      user_answer: 0,
      total_required_answer: 5,
      time_limit: [2, 0],
      time_remaining: '',
      subject_category: 'mathematics',
    },
    {
      id: 8,
      name: 'Answer 10 Mathematics questions in 48 hours to collect 100 points',
      user_answer: 0,
      total_required_answer: 10,
      time_limit: [2, 0],
      time_remaining: '',
      subject_category: 'mathematics',
    },
    {
      id: 9,
      name: 'Answer 25 Mathematics questions in 48 hours to collect 400 points',
      user_answer: 0,
      total_required_answer: 25,
      time_limit: [2, 0],
      time_remaining: '',
      subject_category: 'mathematics',
    },
    {
      id: 10,
      name:
        'Answer 5 Social Studies questions in 48 hours to collect 50 points',
      user_answer: 0,
      total_required_answer: 5,
      time_limit: [2, 0],
      time_remaining: '',
      subject_category: 'social_studies',
    },
    {
      id: 11,
      name:
        'Answer 10 Social Studies questions in 48 hours to collect 100 points',
      user_answer: 0,
      total_required_answer: 10,
      time_limit: [2, 0],
      time_remaining: '',
      subject_category: 'social_studies',
    },
    {
      id: 12,
      name:
        'Answer 25 Social Studies questions in 48 hours to collect 400 points',
      user_answer: 0,
      total_required_answer: 25,
      time_limit: [2, 0],
      time_remaining: '',
      subject_category: 'social_studies',
    },
    {
      id: 13,
      name: 'Answer 5 History questions in 48 hours to collect 50 points',
      user_answer: 0,
      total_required_answer: 5,
      time_limit: [2, 0],
      time_remaining: '',
      subject_category: 'history',
    },
    {
      id: 14,
      name: 'Answer 10 History questions in 48 hours to collect 100 points',
      user_answer: 0,
      total_required_answer: 10,
      time_limit: [2, 0],
      time_remaining: '',
      subject_category: 'history',
    },
    {
      id: 15,
      name: 'Answer 25 History questions in 48 hours to collect 400 points',
      user_answer: 0,
      total_required_answer: 25,
      time_limit: [2, 0],
      time_remaining: '',
      subject_category: 'history',
    },
  ]);
});

router.get('/questions', (req, res) => {
  res.send([
    {
      asker: 'Emmanuel',
      subject_category: 'Mathematics',
      time_asked: 'Just now',
      question_points: 13,
      text:
        "Lindor's Truffles have an outer shell diameter of 1.25 in. and a creamy milk chocolate fudge that makes up the inner circle of the ball that has a diameter of 0.5 in. How much more volume does the outer shell occupy then the inner fudge?",
      watchers: [],
      first_question: true,
    },
  ]);
});

router.get('/institutions', (req, res) => {
  res.send([
    {
      text: 'All',
      link: 'curious.com.ng',
    },
    {
      text: 'OAU',
      link: 'oau.curious.com.ng',
    },
    {
      text: 'Unilag',
      link: 'unilag.curious.com.ng',
    },
    {
      text: 'FUTA',
      link: 'futa.curious.com.ng',
    },
    {
      text: 'UniIbadan',
      link: 'ui.curious.com.ng',
    },
    {
      text: 'UniBen',
      link: 'ui.curious.com.ng',
    },
    {
      text: 'UniIlorin',
      link: 'uniilorin.curious.com.ng',
    },
    {
      text: 'FUTO',
      link: 'futo.curious.com.ng',
    },
  ]);
});

//====================================//

module.exports = router;
