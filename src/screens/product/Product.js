import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Container, Row, Form, Button } from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import './Product.scss';
const Product = () => {
  const q = 0.0000000000000000001602; /* 10^-19*/
  const k = 0.0000000000000000000000138; /* 10^-23*/
  const k1 = 0.0000861;
  const h = 0.0000000000000041356; /* 10^-15 */
  const mo = 0.00000000000000000000000000000091; /* 10^-31 */
  const e0 = 0.00000000000008854; /* 10^-14 */

  const [diodoInformation, setDiodoInformation] = useState({
    type: 'Silicio',
    voltage: 0,
    temperature: 0,
    area: 0,
    Ni: 15400000000,
    n: 2,
    eg: 1.1,
    mn: 1.18 * mo,
    mp: 0.81 * mo,
    Ac: 0,
    er: 12,
    Dp: 0,
    Dn: 0,
    Lp: 0,
    Ln: 0,
    V0: 0,
  });
  const [nTypeInformation, setNTypeInformation] = useState({
    Nd: 100000000000000,
    Up: 0,
    Tp: 0,
    lN: 0,
  });
  const [pTypeInformation, setPTypeInformation] = useState({
    Na: 100000000000000,
    Un: 0,
    Tn: 0,
    lP: 0,
  });
  const [points, setPoints] = useState([]);
  const [pointsTwo, setPointsTwo] = useState([]);
  const [pointsThree, setPointsThree] = useState([]);
  const [VtFinal, setVtFinal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataThirdGraph, setDataThirdGraph] = useState({
    labels: [
      0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4,
      1.5, 1.6, 1.7, 1.8, 1.9, 2,
    ],
    datasets: [
      {
        label: 'Capacitancia asociada',
        data: [],
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  });
  const [dataSecondGraph, setDataSecondGraph] = useState({
    labels: [
      0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4,
      1.5, 1.6, 1.7, 1.8, 1.9, 2,
    ],
    datasets: [
      {
        label: 'Tensión termica',
        data: [],
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  });
  const [dataFirstGraph, setDataFirstGraph] = useState({
    labels: [
      0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4,
      1.5, 1.6, 1.7, 1.8, 1.9, 2,
    ],
    datasets: [
      {
        label: 'Corriente',
        data: [],
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  });
  const makeLabels = async () => {
    const array = [];
    for (let i = -1.3; i < diodoInformation.voltage; i += 0.01) {
      array.push(Number(i.toFixed(2)));
    }
    await setPoints(array);
    return array;
  };
  const makeLabelsTwo = async () => {
    const array = [];
    for (let i = 10; i < 450; i += 5) {
      array.push(i);
    }
    await setPointsTwo(array);
    return array;
  };
  const onChange = async (object, name, value) => {
    if (object === 'diodoInformation') {
      if (value === 'Silicio') {
        setDiodoInformation({
          ...diodoInformation,
          n: 2,
          eg: 1.1,
          mn: 1.18 * mo,
          mp: 0.81 * mo,
          er: 12,
          Ni: 15400000000,
          [name]: value,
        });
      } else if (value === 'Germanio') {
        setDiodoInformation({
          ...diodoInformation,
          n: 1,
          eg: 0.68,
          mn: 0.55 * mo,
          mp: 0.36 * mo,
          er: 15.7,
          Ni: 24000000000000,
          [name]: value,
        });
      } else {
        setDiodoInformation({ ...diodoInformation, [name]: Number(value) });
      }
    } else if (object === 'nTypeInformation') {
      if (name === 'Nd' && value < 100000000000000) {
        await setNTypeInformation({
          ...nTypeInformation,
          [name]: 100000000000000,
        });
      } else if (name === 'Nd' && value > 10000000000000000000) {
        await setNTypeInformation({
          ...nTypeInformation,
          [name]: 10000000000000000000,
        });
      } else {
        await setNTypeInformation({
          ...nTypeInformation,
          [name]: Number(value),
        });
      }
    } else {
      if (name === 'Na' && value < 100000000000000) {
        await setPTypeInformation({
          ...pTypeInformation,
          [name]: 100000000000000,
        });
      } else if (name === 'Na' && value > 10000000000000000000) {
        await setPTypeInformation({
          ...pTypeInformation,
          [name]: 10000000000000000000,
        });
      } else {
        await setPTypeInformation({
          ...pTypeInformation,
          [name]: Number(value),
        });
      }
    }
  };

  const shockleyEquation = (values) => {
    let tempUp = 0;
    let tempUn = 0;
    if (diodoInformation.type === 'Silicio') {
      if (
        nTypeInformation.Nd >= 100000000000000 &&
        nTypeInformation.Nd < 10000000000000000
      ) {
        tempUp = 223.87211;
      } else if (
        nTypeInformation.Nd >= 10000000000000000 &&
        nTypeInformation.Nd < 31622776601683790
      ) {
        tempUp = 199.52623;
      } else if (
        nTypeInformation.Nd >= 31622776601683790 &&
        nTypeInformation.Nd < 100000000000000000
      ) {
        tempUp = 177.82794;
      } else if (
        nTypeInformation.Nd >= 100000000000000000 &&
        nTypeInformation.Nd < 316227766016837940
      ) {
        tempUp = 151.35612;
      } else if (
        nTypeInformation.Nd >= 316227766016837940 &&
        nTypeInformation.Nd < 1000000000000000000
      ) {
        tempUp = 120.22644;
      } else if (
        nTypeInformation.Nd >= 1000000000000000000 &&
        nTypeInformation.Nd < 10000000000000000000
      ) {
        tempUp = 100;
      }
    } else if (diodoInformation.type === 'Germanio') {
      if (
        nTypeInformation.Nd >= 100000000000000 &&
        nTypeInformation.Nd < 1000000000000000
      ) {
        tempUp = 1230.2687;
      } else if (
        nTypeInformation.Nd >= 1000000000000000 &&
        nTypeInformation.Nd < 3162277660168379
      ) {
        tempUp = 1174.8975;
      } else if (
        nTypeInformation.Nd >= 3162277660168379 &&
        nTypeInformation.Nd < 10000000000000000
      ) {
        tempUp = 1122.0184;
      } else if (
        nTypeInformation.Nd >= 10000000000000000 &&
        nTypeInformation.Nd < 31622776601683790
      ) {
        tempUp = 1047.1285;
      } else if (
        nTypeInformation.Nd >= 31622776601683790 &&
        nTypeInformation.Nd < 100000000000000000
      ) {
        tempUp = 794.3282;
      } else if (
        nTypeInformation.Nd >= 100000000000000000 &&
        nTypeInformation.Nd < 316227766016837950
      ) {
        tempUp = 501.1872;
      } else if (
        nTypeInformation.Nd >= 316227766016837950 &&
        nTypeInformation.Nd < 1000000000000000000
      ) {
        tempUp = 251.1886;
      } else if (
        nTypeInformation.Nd >= 1000000000000000000 &&
        nTypeInformation.Nd < 3162277660168379400
      ) {
        tempUp = 141.2537;
      } else {
        tempUp = 114.8153;
      }
    }
    /* Un */
    if (diodoInformation.type === 'Silicio') {
      if (
        pTypeInformation.Na >= 100000000000000 &&
        pTypeInformation.Na < 10000000000000000
      ) {
        tempUn = 1174.8975;
      } else if (
        pTypeInformation.Na >= 10000000000000000 &&
        pTypeInformation.Na < 31622776601683790
      ) {
        tempUn = 1047.1285;
      } else if (
        pTypeInformation.Na >= 31622776601683790 &&
        pTypeInformation.Na < 100000000000000000
      ) {
        tempUn = 1000;
      } else if (
        pTypeInformation.Na >= 100000000000000000 &&
        pTypeInformation.Na < 316227766016837940
      ) {
        tempUn = 501.1872;
      } else if (
        pTypeInformation.Na >= 316227766016837940 &&
        pTypeInformation.Na < 1000000000000000000
      ) {
        tempUn = 199.5262;
      } else if (
        pTypeInformation.Na >= 1000000000000000000 &&
        pTypeInformation.Na < 3162277660168379400
      ) {
        tempUn = 125.8925;
      } else {
        tempUn = 104.7128;
      }
    } else if (diodoInformation.type === 'Germanio') {
      if (
        pTypeInformation.Na >= 100000000000000 &&
        pTypeInformation.Na < 1000000000000000
      ) {
        tempUn = 1995.2623;
      } else if (
        pTypeInformation.Na >= 1000000000000000 &&
        pTypeInformation.Na < 3162277660168379
      ) {
        tempUn = 1778.2794;
      } else if (
        pTypeInformation.Na >= 3162277660168379 &&
        pTypeInformation.Na < 10000000000000000
      ) {
        tempUn = 1659.5869;
      } else if (
        pTypeInformation.Na >= 10000000000000000 &&
        pTypeInformation.Na < 31622776601683790
      ) {
        tempUn = 1548.8166;
      } else if (
        pTypeInformation.Na >= 31622776601683790 &&
        pTypeInformation.Na < 100000000000000000
      ) {
        tempUn = 1412.5375;
      } else if (
        pTypeInformation.Na >= 100000000000000000 &&
        pTypeInformation.Na < 316227766016837950
      ) {
        tempUn = 1258.9254;
      } else if (
        pTypeInformation.Na >= 316227766016837950 &&
        pTypeInformation.Na < 1000000000000000000
      ) {
        tempUn = 1202.2644;
      } else if (
        pTypeInformation.Na >= 1000000000000000000 &&
        pTypeInformation.Na < 3162277660168379400
      ) {
        tempUn = 1122.0184;
      } else {
        tempUn = 1023.2929;
      }
    }

    let Vt = (k * Number(diodoInformation.temperature)) / q;

    const tmpDp = tempUp * Vt;
    const tmpDn = tempUn * Vt;

    const tmpLp = Math.sqrt(tmpDp * nTypeInformation.Tp);
    const tmpLn = Math.sqrt(tmpDn * pTypeInformation.Tn);
    const V0 =
      Vt *
      Math.log(
        (nTypeInformation.Nd * pTypeInformation.Na) / diodoInformation.Ni
      );
    let Wn = [];
    let Wp = [];
    values.forEach((value) => {
      const resXn = Math.sqrt(
        ((2 * e0 * diodoInformation.er) / q) *
          (pTypeInformation.Na /
            (nTypeInformation.Nd *
              (pTypeInformation.Na + nTypeInformation.Nd))) *
          (V0 - value)
      );

      const resXp = Math.sqrt(
        ((2 * e0 * diodoInformation.er) / q) *
          (nTypeInformation.Nd /
            (pTypeInformation.Na *
              (pTypeInformation.Na + nTypeInformation.Nd))) *
          (V0 - value)
      );

      const resWn = nTypeInformation.lN - resXn;
      const resWp = pTypeInformation.lP - resXp;
      Wn.push(resWn);
      Wp.push(resWp);
    });
    let dataGraph = [];
    let Is = [];
    for (let i = 0; i < Wn.length; i++) {
      let res =
        q *
        diodoInformation.area *
        ((tmpDp / tmpLp) *
          (1 / Math.tanh(Wn[i] / tmpLp)) *
          (1 / nTypeInformation.Nd) +
          (tmpDn / tmpLn) *
            (1 / Math.tanh(Wp[i] / tmpLn)) *
            (1 / pTypeInformation.Na)) *
        Math.pow(diodoInformation.Ni, 2);
      Is.push(res);
    }
    values.forEach((value, index) => {
      let res = Is[index] * (Math.exp(value / (diodoInformation.n * Vt)) - 1);
      dataGraph.push(res);
    });
    console.log(Is, dataGraph);
    setDiodoInformation({
      ...diodoInformation,
      Lp: tmpLp,
      Ln: tmpLn,
      Dp: tmpDp,
      Dn: tmpDn,
      V0: V0,
    });
    setVtFinal(Vt);
    setNTypeInformation({ ...nTypeInformation, Up: tempUp });
    setPTypeInformation({ ...pTypeInformation, Un: tempUn });

    setDataFirstGraph({
      labels: points,
      datasets: [
        {
          label: 'Corriente',
          data: dataGraph,
          fill: false,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgba(255, 99, 132, 0.2)',
        },
      ],
    });
    dataFirstGraph.datasets[0].data = dataGraph;
  };
  const V0Equation = () => {
    let graph2 = [];
    pointsTwo.forEach((point) => {
      let Vt = (k * Number(point)) / q;
      graph2.push(Vt);
    });
    setDataSecondGraph({
      labels: pointsTwo,
      datasets: [
        {
          label: 'Tensión termica',
          data: graph2,
          fill: false,
          backgroundColor: 'rgb(104, 227, 135)',
          borderColor: 'rgba(255, 235,150, 0.2)',
        },
      ],
    });
  };
  const capacitanceDepletion = (values) => {
    let Vt = (k * Number(diodoInformation.temperature)) / q;
    const V0 =
      Vt *
      Math.log(
        (nTypeInformation.Nd * pTypeInformation.Na) / diodoInformation.Ni
      );
    let data = [];
    values.forEach((value) => {
      let res =
        (diodoInformation.area *
          Math.sqrt(
            (q *
              e0 *
              diodoInformation.er *
              nTypeInformation.Nd *
              pTypeInformation.Na) /
              (2 * (nTypeInformation.Nd + pTypeInformation.Na))
          )) /
        Math.sqrt(V0 - value);
      data.push(res);
    });
    setDataThirdGraph({
      labels: values,
      datasets: [
        {
          label: 'Capacitancia asociada',
          data: data,
          fill: false,
          backgroundColor: 'rgb(46, 158, 209)',
          borderColor: 'rgba(255, 235,150, 0.2)',
        },
      ],
    });
  };
  const callEquations = async () => {
    setLoading(true);
    const values = await makeLabels();
    await shockleyEquation(values);
    capacitanceDepletion(values);
    V0Equation();
    setLoading(false);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    await callEquations();
  };
  useEffect(() => {
    makeLabels();
  }, [diodoInformation.voltage]);
  useEffect(() => {
    makeLabelsTwo();
  }, []);
  return (
    <>
      <Container fluid>
        <Row>
          <div className="offset-1 col-5 max-height ">
            <Form onSubmit={onSubmit} className="mb-4">
              <Row>
                <div className="col-6">
                  <Form.Group className="mt-4">
                    <Form.Label> Temperatura (K)</Form.Label>
                    <Form.Control
                      type="number"
                      required
                      value={diodoInformation.temperature}
                      onChange={(e) => {
                        onChange(
                          'diodoInformation',
                          'temperature',
                          e.target.value
                        );
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mt-4">
                    <Form.Label> Area (cm^2)</Form.Label>
                    <Form.Control
                      type="number"
                      required
                      value={diodoInformation.area}
                      onChange={(e) => {
                        onChange('diodoInformation', 'area', e.target.value);
                      }}
                    />
                  </Form.Group>
                </div>
                <div className="col-6 ">
                  <Form.Group className="mt-4">
                    <Form.Label> Tipo de semiconductor</Form.Label>
                    <Form.Control
                      as="select"
                      value={diodoInformation.type}
                      onChange={(e) => {
                        onChange('diodoInformation', 'type', e.target.value);
                      }}
                    >
                      <option>Silicio</option>
                      <option>Germanio</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group className="mt-4">
                    <Form.Label> Voltaje (V)</Form.Label>
                    <Form.Control
                      type="number"
                      value={diodoInformation.voltage}
                      onChange={(e) => {
                        onChange('diodoInformation', 'voltage', e.target.value);
                      }}
                    />
                  </Form.Group>
                </div>
              </Row>
              <h4>Región tipo N</h4>
              <hr />
              <div className="row">
                <div className="col-6">
                  <Form.Label> Nd (cm^-3)</Form.Label>
                  <Form.Control
                    type="text"
                    value={nTypeInformation.Nd}
                    onChange={(e) => {
                      onChange('nTypeInformation', 'Nd', e.target.value);
                    }}
                  />
                </div>
                <div className="col-6 mt-4">
                  <RangeSlider
                    value={nTypeInformation.Nd}
                    min={100000000000000}
                    max={10000000000000000000}
                    onChange={(e) => {
                      onChange('nTypeInformation', 'Nd', e.target.value);
                    }}
                    size="lg"
                  />
                </div>
              </div>
              <Row>
                <div className="col-6">
                  <Form.Group className="mt-2">
                    <Form.Label> ln (um)</Form.Label>
                    <Form.Control
                      type="number"
                      value={nTypeInformation.lN}
                      onChange={(e) => {
                        onChange('nTypeInformation', 'lN', e.target.value);
                      }}
                    />
                  </Form.Group>
                </div>
                <div className="col-6">
                  <Form.Group className="mt-2">
                    <Form.Label> Tp (s)</Form.Label>
                    <Form.Control
                      type="number"
                      value={nTypeInformation.Tp}
                      onChange={(e) => {
                        onChange('nTypeInformation', 'Tp', e.target.value);
                      }}
                    />
                  </Form.Group>
                </div>
              </Row>
              <h4>Region tipo P</h4>
              <hr />
              <div className="row">
                <div className="col-6">
                  <Form.Label> Na (cm^-3)</Form.Label>
                  <Form.Control
                    type="text"
                    value={pTypeInformation.Na}
                    onChange={(e) => {
                      onChange('pTypeInformation', 'Na', e.target.value);
                    }}
                  />
                </div>
                <div className="col-6 mt-4">
                  <RangeSlider
                    value={pTypeInformation.Na}
                    min={100000000000000}
                    max={10000000000000000000}
                    onChange={(e) => {
                      onChange('pTypeInformation', 'Na', e.target.value);
                    }}
                    size="lg"
                  />
                </div>
              </div>
              <Row>
                <div className="col-6">
                  <Form.Group className="mt-2">
                    <Form.Label> lp (um)</Form.Label>
                    <Form.Control
                      type="number"
                      value={pTypeInformation.lP}
                      onChange={(e) => {
                        onChange('pTypeInformation', 'lP', e.target.value);
                      }}
                    />
                  </Form.Group>
                </div>
                <div className="col-6">
                  <Form.Group className="mt-2">
                    <Form.Label> Tn (s)</Form.Label>
                    <Form.Control
                      type="number"
                      value={pTypeInformation.Tn}
                      onChange={(e) => {
                        onChange('pTypeInformation', 'Tn', e.target.value);
                      }}
                    />
                  </Form.Group>
                </div>
              </Row>

              <div className=" right">
                <Button className="mt-3 mb-3 mr-2" type="submit">
                  Graficar
                </Button>
              </div>
              <h4>Resultados</h4>
              <hr />
              {loading ? (
                <span>Cargando...</span>
              ) : (
                <div>
                  <Row>
                    <div className="col-6">Up: {nTypeInformation.Up}</div>
                    <div className="col-6">Un: {pTypeInformation.Un}</div>
                  </Row>
                  <Row>
                    <div className="col-6">Dp: {diodoInformation.Dp}</div>
                    <div className="col-6">Dn: {diodoInformation.Dn}</div>
                  </Row>
                  <Row>
                    <div className="col-6">Lp: {diodoInformation.Lp}</div>
                    <div className="col-6">Ln: {diodoInformation.Ln}</div>
                  </Row>
                  <Row>
                    <div className="col-6">V0: {diodoInformation.V0}</div>
                    <div className="col-6">Ni: {diodoInformation.Ni}</div>
                  </Row>
                </div>
              )}
            </Form>
          </div>

          <div className="col-5 max-height">
            <div>
              {loading ? null : (
                <div>
                  <Line
                    data={dataFirstGraph}
                    options={{
                      title: {
                        display: true,
                        text: 'Average Rainfall per month',
                        fontSize: 20,
                      },
                      legend: {
                        display: true,
                        position: 'right',
                      },
                    }}
                  />
                  <Line
                    data={dataSecondGraph}
                    options={{
                      title: {
                        display: true,
                        text: 'Average Rainfall per month',
                        fontSize: 20,
                      },
                      legend: {
                        display: true,
                        position: 'right',
                      },
                    }}
                  />
                  <Line
                    data={dataThirdGraph}
                    options={{
                      title: {
                        display: true,
                        text: 'Average Rainfall per month',
                        fontSize: 20,
                      },
                      legend: {
                        display: true,
                        position: 'right',
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Product;
