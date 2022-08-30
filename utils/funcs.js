import bcrypt from "bcryptjs";
import crypto from "crypto";
import cryptoJS from "crypto-js";
import { v4 } from "uuid";

export const genHash = (pass) => {
  return new Promise((res, rej) => {
    bcrypt.hash(pass, 8, function (err, hash) {
      if (err) {
        rej(err);
      }
      if (hash) {
        res(hash);
      }
    });
  });
};

export const compareHash = (inputPass, hash) => {
  return new Promise((res, rej) => {
    bcrypt.compare(inputPass, hash, function (err, matched) {
      if (err) {
        rej(false);
      }
      if (res) {
        res(matched);
      }
    });
  });
};

export function getBase64(imgFile) {
  var reader = new FileReader();
  reader.readAsDataURL(imgFile);

  return new Promise((res, rej) => {
    reader.onload = function () {
      res(reader.result);
    };
    reader.onerror = function (error) {
      rej(error);
    };
  });
}

export const getResetToken = () => {
  return new Promise((res, rej) => {
    const uid = crypto.randomBytes(32).toString("hex");

    const encryptToken = crypto.createHash("sha256").update(uid).digest("hex");
    res({ encryptToken, token: uid });
  });
};

export const Daysinbetween = (date1, date2) => {
  const ONE_DAY = 1000 * 60 * 60 * 24;
  const newdate1 = new Date(date1).getTime();
  const newdate2 = new Date(date2).getTime();

  const differenceMs = Math.abs(newdate1 - newdate2);
  return Math.round(differenceMs / ONE_DAY);
};

//when search is none page is none or page more
//when search is on but page is none or page more

// React.useEffect(() => {
//   if (pageReset) {
//     setPageReset(false);
//     return;
//   }

//   if (initialRender) {
//     setInitialRender(false);
//     return;
//   }

//   dispatch(
//     fetchAllAdminRooms({
//       page: Number(page) + 1,
//       limit: Number(rowsPerPage),
//       search: term ? term : "",
//     })
//   );
// }, [page, rowsPerPage]);

// React.useEffect(() => {
//   if (page > 0) {
//     setPage(0);
//     setPageReset(true);
//   }

//   if (term) {
//     dispatch(
//       fetchAllAdminRooms({
//         page: 1,
//         limit: rowsPerPage,
//         search: term,
//       })
//     );
//   }

//   if (term === "") {
//     setSearchReset(true);
//   }
// }, [term]);

// React.useEffect(() => {
//   if (searchReset) {
//     dispatch(
//       fetchAllAdminRooms({
//         page: 1,
//         limit: rowsPerPage,
//       })
//     );
//     setSearchReset(false);
//   }
// }, [searchReset]);

// React.useEffect(() => {
//   if (error) {
//     toast.error("An Error occured while Deleting Room", {
//       position: "top-right",
//     });
//   }
//   if (isDeleted) {
//     toast.success("Room is Deleted", { position: "top-right" });
//     dispatch(
//       fetchAllAdminRooms({
//         limit: rowsPerPage,
//         page: Number(page) + 1,
//         search: term ? term : "",
//       })
//     );
//   }
// }, [isDeleted, error]);
