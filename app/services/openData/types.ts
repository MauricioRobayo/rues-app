export interface OpenDataCompany {
  camara_comercio: string;
  categoria_matricula: string;
  ciiu3?: string;
  ciiu4?: string;
  clase_identificacion_rl?: string;
  clase_identificacion: string;
  cod_ciiu_act_econ_pri: string;
  cod_ciiu_act_econ_sec?: string;
  codigo_camara: string;
  codigo_categoria_matricula: string;
  codigo_clase_identificacion: string;
  codigo_estado_matricula: string;
  codigo_organizacion_juridica: string;
  codigo_tipo_sociedad: string;
  digito_verificacion?: string;
  estado_matricula: string;
  fecha_actualizacion: string;
  fecha_cancelacion?: string;
  fecha_matricula: string;
  fecha_renovacion?: string;
  fecha_vigencia?: string;
  inscripcion_proponente: string;
  matricula: string;
  nit: string; // filter not null on queries
  num_identificacion_representante_legal?: string;
  organizacion_juridica: string;
  primer_apellido?: string;
  primer_nombre?: string;
  razon_social: string;
  representante_legal?: string;
  segundo_apellido?: string;
  segundo_nombre?: string;
  sigla?: string;
  tipo_sociedad: string;
  ultimo_ano_renovado: string;
}

export interface OpenDataEstablishment {
  codigo_camara: string;
  camara_comercio: string;
  matricula: string;
  ultimo_ano_renovado: string;
  fecha_renovacion: string;
  razon_social: string;
  codigo_estado_matricula: string;
  estado_matricula: string;
  cod_ciiu_act_econ_pri: string;
  cod_ciiu_act_econ_sec: string;
  ciiu3: string;
  ciiu4: string;
  fecha_cancelacion: string;
  codigo_clase_identificacion: string;
  clase_identificacion: string;
  numero_identificacion: string;
  nit_propietario: string;
  digito_verificacion: string;
  codigo_camara_propietario: string;
  camara_comercio_propitario: string;
  matr_cula_propietario: string;
  codigo_tipo_propietario: string;
  tipo_propietario: string;
  categoria_matricula: string;
}
