import { NextApiRequest, NextApiResponse } from "next";
import { createDeck } from "util/db/deck";
import { checkAuth } from "util/auth";

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    checkAuth(req);
  } catch (err) {
    return res.status(401).send(err.message);
  }

  if (
    req.body.userID &&
    !req["user"].sub == req.body.userID &&
    !req["user"].role.includes("admin")
  )
    throw Error(`Can't create a deck for someone else`);

  switch (req.method) {
    case "POST":
      await createDeck(
        req.body.title,
        req.body.userID ? req.body.userID : req["user"].sub,
        req.body.subject,
        req.body.module
      )
        .then((value) => {
          return res.send(value);
        })
        .catch((err) => {
          return res.send(err);
        });

    default:
      return res.status(405).end();
  }
};

export default index;
