import type {
	INodeType,
	INodeTypeData,
	INodeTypes,
	IVersionedNodeType,
	IConnections,
	IDataObject,
	INode,
	IPinData,
	IWorkflowSettings,
} from 'n8n-workflow';
import { NodeHelpers, Workflow } from 'n8n-workflow';
import { uuid } from '@jsplumb/util';
import { defaultMockNodeTypes } from '@/__tests__/defaults';
import type { INodeUi, ITag, IUsedCredential, IWorkflowDb, WorkflowMetadata } from '@/Interface';
import type { ProjectSharingData } from '@/types/projects.types';
import type { RouteLocationNormalized } from 'vue-router';

export function createTestNodeTypes(data: INodeTypeData = {}): INodeTypes {
	const nodeTypes = {
		...defaultMockNodeTypes,
		...Object.keys(data).reduce<INodeTypeData>((acc, key) => {
			acc[key] = data[key];

			return acc;
		}, {}),
	};

	function getKnownTypes(): IDataObject {
		return {};
	}

	function getByName(nodeType: string): INodeType | IVersionedNodeType {
		return nodeTypes[nodeType].type;
	}

	function getByNameAndVersion(nodeType: string, version?: number): INodeType {
		return NodeHelpers.getVersionedNodeType(getByName(nodeType), version);
	}

	return {
		getKnownTypes,
		getByName,
		getByNameAndVersion,
	};
}

export function createTestWorkflowObject({
	id = uuid(),
	name = 'Test Workflow',
	nodes = [],
	connections = {},
	active = false,
	nodeTypes = {},
	staticData = {},
	settings = {},
	pinData = {},
}: {
	id?: string;
	name?: string;
	nodes?: INode[];
	connections?: IConnections;
	active?: boolean;
	nodeTypes?: INodeTypeData;
	staticData?: IDataObject;
	settings?: IWorkflowSettings;
	pinData?: IPinData;
} = {}) {
	return new Workflow({
		id,
		name,
		nodes,
		connections,
		active,
		staticData,
		settings,
		pinData,
		nodeTypes: createTestNodeTypes(nodeTypes),
	});
}

export function createTestWorkflow(options: {
	id?: string;
	name: string;
	active?: boolean;
	createdAt?: number | string;
	updatedAt?: number | string;
	nodes?: INodeUi[];
	connections?: IConnections;
	settings?: IWorkflowSettings;
	tags?: ITag[] | string[];
	pinData?: IPinData;
	sharedWithProjects?: ProjectSharingData[];
	homeProject?: ProjectSharingData;
	versionId?: string;
	usedCredentials?: IUsedCredential[];
	meta?: WorkflowMetadata;
}): IWorkflowDb {
	return {
		...options,
		createdAt: options.createdAt ?? '',
		updatedAt: options.updatedAt ?? '',
		versionId: options.versionId ?? '',
		id: options.id ?? uuid(),
		active: options.active ?? false,
		connections: options.connections ?? {},
	} as IWorkflowDb;
}

export function createTestNode(node: Partial<INode> = {}): INode {
	return {
		id: uuid(),
		name: 'Node',
		type: 'n8n-nodes-base.test',
		typeVersion: 1,
		position: [0, 0] as [number, number],
		parameters: {},
		...node,
	};
}

export function createTestRouteLocation({
	path = '',
	params = {},
	fullPath = path,
	hash = '',
	matched = [],
	redirectedFrom = undefined,
	name = path,
	meta = {},
	query = {},
}: Partial<RouteLocationNormalized> = {}): RouteLocationNormalized {
	return {
		path,
		params,
		fullPath,
		hash,
		matched,
		redirectedFrom,
		name,
		meta,
		query,
	};
}
