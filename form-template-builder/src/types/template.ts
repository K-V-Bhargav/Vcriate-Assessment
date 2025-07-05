export type FieldType = 'label' | 'text' | 'number' | 'boolean' | 'enum';

export type LabelStyle = 'h1' | 'h2' | 'h3';

export interface BaseField {
  id: string;
  type: FieldType;
  name: string;
}

export interface LabelField extends BaseField {
  type: 'label';
  labelStyle: LabelStyle;
  value: string;
}

export interface TextField extends BaseField {
  type: 'text';
  placeholder?: string;
  required?: boolean;
  value?: string;
}

export interface NumberField extends BaseField {
  type: 'number';
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  value?: number;
}

export interface BooleanField extends BaseField {
  type: 'boolean';
  label: string;
  value?: boolean;
}

export interface EnumField extends BaseField {
  type: 'enum';
  options: { label: string; value: string }[];
  placeholder?: string;
  required?: boolean;
  value?: string;
}

export type Field = LabelField | TextField | NumberField | BooleanField | EnumField;

export interface Section {
  id: string;
  title: string;
  fields: Field[];
}

export interface Template {
  id: string;
  name: string;
  sections: Section[];
  createdAt: number;
  updatedAt: number;
}

export interface FormData {
  templateId: string;
  values: Record<string, any>;
  submittedAt: number;
}
