import * as cdk from '@aws-cdk/core'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as ecr from '@aws-cdk/aws-ecr'
import * as ecs from '@aws-cdk/aws-ecs'
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2'
import * as iam from '@aws-cdk/aws-iam'
import * as rds from '@aws-cdk/aws-rds'
import * as logs from '@aws-cdk/aws-logs'
import * as dotenv from 'dotenv'

dotenv.config()

export class AppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const resourcesPrefix: string = 'laravel-bbs'

    const appImageRepo = new ecr.Repository(this, 'appImageRepo', { repositoryName: `${resourcesPrefix}-app` })
    cdk.Tags.of(appImageRepo).add('Name', `${resourcesPrefix}-vpc`)

    const nginxImageRepo = new ecr.Repository(this, 'nginxImageRepo', { repositoryName: `${resourcesPrefix}-nginx` })
    cdk.Tags.of(nginxImageRepo).add('Name', `${resourcesPrefix}-vpc`)

    const vpc = new ec2.Vpc(this, 'vpc', {
      maxAzs: 2,
      natGateways: 1,
      cidr: '10.0.0.0/16',
      subnetConfiguration: [
        { cidrMask: 24, name: 'alb_public_', subnetType: ec2.SubnetType.PUBLIC },
        { cidrMask: 24, name: 'ecs_private_', subnetType: ec2.SubnetType.PRIVATE },
        { cidrMask: 24, name: 'rds_isolated_', subnetType: ec2.SubnetType.ISOLATED },
      ],
    })
    cdk.Tags.of(vpc).add('Name', `${resourcesPrefix}-vpc`)

    const albSg = new ec2.SecurityGroup(this, 'albSg', { vpc, allowAllOutbound: true })
    albSg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80))
    albSg.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic())
    cdk.Tags.of(albSg).add('Name', `${resourcesPrefix}-alb-Sg`)

    const ecsSg = new ec2.SecurityGroup(this, 'ecsSg', { vpc, allowAllOutbound: true })
    ecsSg.addIngressRule(ec2.Peer.ipv4('10.0.0.0/16'), ec2.Port.tcp(80))
    ecsSg.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic())
    cdk.Tags.of(ecsSg).add('Name', `${resourcesPrefix}-ecs-Sg`)

    const rdsSg = new ec2.SecurityGroup(this, 'rdsSg', { vpc, allowAllOutbound: true })
    rdsSg.addIngressRule(ec2.Peer.ipv4('10.0.0.0/16'), ec2.Port.tcp(3306))
    rdsSg.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic())
    cdk.Tags.of(rdsSg).add('Name', `${resourcesPrefix}-db-Sg`)

    const db = new rds.DatabaseInstance(this, 'db', {
      vpc,
      vpcSubnets: { subnets: vpc.isolatedSubnets },
      engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_5_7 }),
      instanceIdentifier: `${resourcesPrefix}-db`,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      allocatedStorage: 20,
      databaseName: process.env.DATABASE_NAME || '',
      credentials: {
        username: process.env.DATABASE_USERNAME || '',
        password: cdk.SecretValue.plainText(process.env.DATABASE_PASSWORD || ''),
      },
      port: 3306,
      multiAz: false,
      securityGroups: [rdsSg],
    })
    cdk.Tags.of(db).add('Name', `${resourcesPrefix}-db`)

    const ecsTaskExecutionRole = new iam.Role(this, 'ecsTaskExecutionRole', {
      roleName: 'ecs-task-execution-role',
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMReadOnlyAccess'),
      ],
    })
    cdk.Tags.of(ecsTaskExecutionRole).add('Name', `${resourcesPrefix}-ecs-task-execution-role`)

    const cluster = new ecs.Cluster(this, 'cluster', {
      vpc,
      clusterName: `${resourcesPrefix}-cluster`,
    })
    cdk.Tags.of(cluster).add('Name', `${resourcesPrefix}-cluster`)

    const logGroup = new logs.LogGroup(this, 'logGroup', { logGroupName: '/ecs/laravel' })
    cdk.Tags.of(logGroup).add('Name', `${resourcesPrefix}-log-group`)

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'taskDefinition', {
      family: `${resourcesPrefix}-app`,
      cpu: 256,
      memoryLimitMiB: 512,
      executionRole: ecsTaskExecutionRole,
      taskRole: ecsTaskExecutionRole,
    })
    cdk.Tags.of(taskDefinition).add('Name', `${resourcesPrefix}-task-definition`)

    const appContainer = new ecs.ContainerDefinition(this, 'appContainer', {
      containerName: 'app',
      taskDefinition,
      image: ecs.ContainerImage.fromEcrRepository(ecr.Repository.fromRepositoryName(this, 'appImage', `${resourcesPrefix}-app`)),
      logging: ecs.LogDriver.awsLogs({ streamPrefix: 'app', logGroup }),
      environment: {
        DB_HOST: db.dbInstanceEndpointAddress,
        DB_DATABASE: process.env.DATABASE_NAME || '',
        DB_PASSWORD: process.env.DATABASE_PASSWORD || '',
        DB_USERNAME: process.env.DATABASE_USERNAME || '',
      },
      workingDirectory: '/var/www',
    })
    cdk.Tags.of(appContainer).add('Name', `${resourcesPrefix}-app-container`)

    const nginxContainer = new ecs.ContainerDefinition(this, 'nginxContainer', {
      containerName: 'nginx',
      taskDefinition,
      image: ecs.ContainerImage.fromEcrRepository(ecr.Repository.fromRepositoryName(this, 'nginxImage', `${resourcesPrefix}-nginx`)),
      logging: ecs.LogDriver.awsLogs({ streamPrefix: 'nginx', logGroup }),
      portMappings: [{ protocol: ecs.Protocol.TCP, containerPort: 80 }],
      workingDirectory: '/var/www',
    })
    cdk.Tags.of(nginxContainer).add('Name', `${resourcesPrefix}-nginx-container`)
    nginxContainer.addVolumesFrom({ sourceContainer: 'app', readOnly: false })
    taskDefinition.defaultContainer = nginxContainer

    const ecsService = new ecs.FargateService(this, 'ecsService', {
      vpcSubnets: { subnets: vpc.privateSubnets },
      serviceName: `${resourcesPrefix}-service`,
      cluster,
      taskDefinition,
      desiredCount: 1,
      minHealthyPercent: 100,
      maxHealthyPercent: 200,
      assignPublicIp: true,
      securityGroup: ecsSg,
    })

    const alb = new elbv2.ApplicationLoadBalancer(this, 'alb', {
      vpc,
      vpcSubnets: { subnets: vpc.publicSubnets },
      securityGroup: albSg,
      internetFacing: true,
    })
    const listener = alb.addListener('listener', { port: 80, open: true })
    const targetGroup = listener.addTargets('targetGroup', { port: 80, targets: [ecsService] })
  }
}
