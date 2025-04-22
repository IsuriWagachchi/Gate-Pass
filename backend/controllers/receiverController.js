import Request from '../models/requestModel.js';

// Get all requests
const getRequests = async (req, res) => {
    try {
        const serviceNo = req.user.service_no;
        const requests = await Request.find({ service_no: serviceNo });
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching requests', error: err });
    }
};