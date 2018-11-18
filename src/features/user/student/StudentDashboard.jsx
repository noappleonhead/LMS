import React, { Component } from "react";
import { DataTable } from "react-data-components";

var columns = [
  { title: "Id", prop: "id" },
  { title: "Name", prop: "fullName" },
  { title: "DOB", prop: "dateOfBirth" },
  { title: "Email", prop: "email" },
  { title: "Credit", prop: "credit" }
];
// axios data in
let studentData = [
  {
    $id: "2",
    id: 1,
    fullName: "Robin Williams",
    gender: "M",
    dateOfBirth: "1958-04-12T00:00:00",
    email: "test@test.com",
    credit: 16
  },
  {
    $id: "3",
    id: 2,
    fullName: "Jonh Smith",
    gender: "M",
    dateOfBirth: "1979-01-01T00:00:00",
    email: "nweaver@hotmail.com",
    credit: 16
  },
  {
    $id: "4",
    id: 3,
    fullName: "Andrew Bauer",
    gender: "F",
    dateOfBirth: "1980-02-02T00:00:00",
    email: "eabrown@yahoo.com",
    credit: 16
  },
  {
    $id: "5",
    id: 4,
    fullName: "Graeme Duffey",
    gender: "M",
    dateOfBirth: "1981-03-03T00:00:00",
    email: "dimensio@hotmail.com",
    credit: 16
  },
  {
    $id: "6",
    id: 5,
    fullName: "Graham Barrie",
    gender: "M",
    dateOfBirth: "1982-04-04T00:00:00",
    email: "zwood@yahoo.ca",
    credit: 16
  },
  {
    $id: "7",
    id: 6,
    fullName: "Andy Miller",
    gender: "F",
    dateOfBirth: "1983-05-05T00:00:00",
    email: "psharpe@icloud.com",
    credit: 16
  },
  {
    $id: "8",
    id: 7,
    fullName: "Abhinav Abhinav",
    gender: "M",
    dateOfBirth: "1984-06-06T00:00:00",
    email: "grossman@mac.com",
    credit: 16
  },
  {
    $id: "9",
    id: 8,
    fullName: "Greg Sweet",
    gender: "M",
    dateOfBirth: "1985-07-07T00:00:00",
    email: "knorr@gmail.com",
    credit: 16
  },
  {
    $id: "10",
    id: 9,
    fullName: "Richard Buisson",
    gender: "M",
    dateOfBirth: "1986-08-08T00:00:00",
    email: "richard.bblixem@yahoo.com",
    credit: 16
  },
  {
    $id: "11",
    id: 10,
    fullName: "Leonie Hall",
    gender: "F",
    dateOfBirth: "1987-09-09T00:00:00",
    email: "lstaf@att.net",
    credit: 16
  }
];

export default class StudentList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <DataTable
        className="container"
        keys="id"
        columns={columns}
        initialData={studentData}
        initialPageLength={5}
        initialSortBy={{ prop: "city", order: "descending" }}
        pageLengthOptions={[5, 20, 50]}
      />
    );
  }
}
